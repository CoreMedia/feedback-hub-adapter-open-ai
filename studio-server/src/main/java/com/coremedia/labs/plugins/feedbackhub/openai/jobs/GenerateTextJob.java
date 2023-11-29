package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIClientProvider;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.google.gson.annotations.SerializedName;
import com.theokanning.openai.completion.CompletionChoice;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

public class GenerateTextJob implements Job {
  private static final Logger LOG = LoggerFactory.getLogger(GenerateTextJob.class);

  public static final String ACTION_SUMMARIZE = "summarize";
  public static final String ACTION_GENERATE_TITLE = "title";
  public static final String ACTION_GENERATE_HEADLINE = "headline";
  public static final String ACTION_GENERATE_METADATA = "metadata";
  public static final String ACTION_EXTRACT_KEYWORDS = "keywords";
  public static final int CHAT_GPT_MAX_MSG_LENGTH = 4096;

  private String prompt;
  private String contentId;
  private String siteId;
  private String groupId;
  private String actionId;

  private final OpenAISettingsProvider settingsProvider;

  public GenerateTextJob(OpenAISettingsProvider settingsProvider) {
    this.settingsProvider = settingsProvider;
  }

  @SerializedName("prompt")
  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  @SerializedName("contentId")
  public void setContentId(String contentId) {
    this.contentId = contentId;
  }

  @SerializedName("siteId")
  public void setSiteId(String siteId) {
    this.siteId = siteId;
  }

  @SerializedName("groupId")
  public void setGroupId(String groupId) {
    this.groupId = groupId;
  }

  @SerializedName("actionId")
  public void setActionId(String actionId) {
    this.actionId = actionId;
  }

  @Nullable
  @Override
  public Object call(@NonNull JobContext jobContext) throws JobExecutionException {
    String model = null;
    String text = null;

    OpenAISettings settings = getSettings();
    String updatedPrompt = applyUserAction(settings, prompt, actionId);
    String sanitized = sanitizePrompt(updatedPrompt);

    try {
      model = settings.getLanguageModel();
      Integer timeoutInSeconds = settings.getTimeoutInSeconds() != null ? settings.getTimeoutInSeconds() : 30;
      OpenAiService client;
      String baseUrl = settings.getBaseUrl();
      if (isNotBlank(baseUrl)) {
        client = OpenAIClientProvider.getClient(baseUrl, settings.getApiKey(), Duration.ofSeconds(timeoutInSeconds));
      } else {
        client = OpenAIClientProvider.getClient(settings.getApiKey(), Duration.ofSeconds(timeoutInSeconds));
      }

      int temparature = (settings.getTemperature() != null ? settings.getTemperature() : 30) / 100;
      int maxTokens = settings.getMaxTokens() != null ? settings.getMaxTokens() : 1000;

      if (model.contains("4") || model.contains("3.5")) {
        List<ChatMessage> messages = new ArrayList<>();
        ChatMessage userMessage = new ChatMessage(ChatMessageRole.USER.value(), sanitized);
        messages.add(userMessage);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
          .messages(messages)
          .model(model)
          .user(String.valueOf(contentId))
          .maxTokens(maxTokens)
          .temperature((double) temparature)
          .build();

        ChatCompletionChoice chatCompletionChoice = client.createChatCompletion(request).getChoices().get(0);
        text = chatCompletionChoice.getMessage().getContent();
      } else {
        CompletionRequest request = CompletionRequest.builder()
          .prompt(sanitized)
          .model(model)
          .user(String.valueOf(contentId))
          .maxTokens(maxTokens)
          .temperature((double) temparature)
          .echo(false)
          .build();

        Optional<CompletionChoice> first = client.createCompletion(request).getChoices().stream().findFirst();
        if (first.isPresent()) {
          CompletionChoice completionChoice = first.get();
          if (completionChoice.getFinish_reason() != null && !completionChoice.getFinish_reason().equals("stop")) {
            LOG.info("Text generation stopped, reason: " + completionChoice.getFinish_reason());
          }
          text = completionChoice.getText().trim();

          if (StringUtils.isEmpty(text)) {
            LOG.info("Text generation was empty, finish reason: " + completionChoice.getFinish_reason());
          }
        }
      }

      return text.trim();
    } catch (Exception e) {
      LOG.error("Failed to generate text with language model \"{}\" for given prompt: \"{}\" on content {}: {}", model, prompt, contentId, e.getMessage());
      throw new JobExecutionException(GenericJobErrorCode.FAILED, e.getMessage());
    }
  }

  /**
   * Ensure that the max message length is not exceeded.
   * Otherwise the message "overflow" would be sent with the next chat message.
   *
   * @param updatedPrompt the user prompt, may be already customized depending on the actionId
   * @return the sanitized user prompt
   */
  private String sanitizePrompt(String updatedPrompt) {
    if (updatedPrompt.length() > CHAT_GPT_MAX_MSG_LENGTH) {
      updatedPrompt = updatedPrompt.substring(0, CHAT_GPT_MAX_MSG_LENGTH);
      if (updatedPrompt.contains(".")) {
        updatedPrompt = updatedPrompt.substring(0, updatedPrompt.lastIndexOf("."));
      }
    }
    return updatedPrompt;
  }

  /**
   * Depending on the user action, we do a little prompt engineering to customize the output.
   *
   * @param settings
   * @param prompt   the question the user has entered OR the text OpenAI has generated for the original question
   * @param actionId an action if the user has already entered a question or null if the first AI is given
   * @return the modified prompt with optional additional commands
   */
  private String applyUserAction(OpenAISettings settings, String prompt, String actionId) {
    if (StringUtils.isEmpty(actionId)) {
      prompt = "Answer with less than 500 words or 4000 characters: " + prompt;
      return prompt;
    }

    String promptPrefix = null;
    switch (actionId) {
      case ACTION_SUMMARIZE: {
        promptPrefix = !StringUtils.isEmpty(settings.getSummaryPrompt()) ? settings.getSummaryPrompt() : "Summarize the following text";
        break;
      }
      case ACTION_EXTRACT_KEYWORDS: {
        promptPrefix = !StringUtils.isEmpty(settings.getKeywordsPrompt()) ? settings.getKeywordsPrompt() : "Extract the keywords from the following text with a total maximum length of 255 characters";
        break;
      }
      case ACTION_GENERATE_HEADLINE: {
        promptPrefix = !StringUtils.isEmpty(settings.getHeadlinePrompt()) ? settings.getHeadlinePrompt() : "Create an article headline from the following text";
        break;
      }
      case ACTION_GENERATE_METADATA: {
        promptPrefix = !StringUtils.isEmpty(settings.getMetadataPrompt()) ? settings.getMetadataPrompt() : "Summarize the following text in one sentence";
        break;
      }
      case ACTION_GENERATE_TITLE: {
        promptPrefix = !StringUtils.isEmpty(settings.getTitlePrompt()) ? settings.getTitlePrompt() : "Generate a title from the following text with a maximum length of 60 characters";
        break;
      }
      default: {
        throw new UnsupportedOperationException("Invalid actionId '" + actionId + "'");
      }
    }
    return formatActionPrompt(promptPrefix) + prompt;
  }

  private OpenAISettings getSettings() {
    return settingsProvider.getSettings(groupId, siteId);
  }

  private String formatActionPrompt(String prompt) {
    if (prompt != null && !prompt.endsWith(":")) {
      prompt += ":\n\n";
    }
    return prompt;
  }
}
