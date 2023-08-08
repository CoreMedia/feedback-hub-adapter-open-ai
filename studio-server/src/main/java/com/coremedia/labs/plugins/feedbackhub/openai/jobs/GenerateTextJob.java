package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.labs.plugins.feedbackhub.openai.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIClientProvider;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.google.gson.annotations.SerializedName;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GenerateTextJob implements Job {
  private static final Logger LOG = LoggerFactory.getLogger(GenerateTextJob.class);


  private String prompt;
  private Double temperature;
  private int maxLength;
  private String contentId;
  private String siteId;
  private String groupId;

  private final FeedbackSettingsProvider settingsProvider;

  public GenerateTextJob(FeedbackSettingsProvider settingsProvider) {
    this.settingsProvider = settingsProvider;
  }

  @SerializedName("prompt")
  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  @SerializedName("temperature")
  public void setTemperature(Double temperature) {
    this.temperature = temperature;
  }

  @SerializedName("maxLength")
  public void setMaxLength(int maxLength) {
    this.maxLength = maxLength;
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

  @Nullable
  @Override
  public Object call(@NonNull JobContext jobContext) throws JobExecutionException {
    String model = null;
    String text = null;

    try {
      OpenAISettings settings = getSettings();
      model = settings.getLanguageModel();
      OpenAiService client = OpenAIClientProvider.getClient(settings.getApiKey(), Duration.ofSeconds(settings.getTimeoutInSeconds()));

      if (model.contains("4") || model.contains("3.5")) {
        List<ChatMessage> messages = new ArrayList<>();
        ChatMessage userMessage = new ChatMessage(ChatMessageRole.USER.value(), prompt);
        messages.add(userMessage);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
          .messages(messages)
          .model(model)
          .maxTokens(maxLength)
          .temperature(temperature)
          .build();

        ChatCompletionChoice chatCompletionChoice = client.createChatCompletion(request).getChoices().get(0);
        text = chatCompletionChoice.getMessage().getContent();
      } else {
        CompletionRequest request = CompletionRequest.builder()
          .prompt(prompt)
          .model(model)
          .maxTokens(maxLength)
          .temperature(temperature)
          .echo(false)
          .build();

        text = client.createCompletion(request)
          .getChoices()
          .stream()
          .findFirst()
          .orElseThrow()
          .getText()
          .trim();
      }

      return text.trim();
    } catch (Exception e) {
      LOG.error("Failed to generate text with language model \"{}\" for given prompt: \"{}\" on content {}: {}", model, prompt, contentId, e.getMessage());
      throw new JobExecutionException(GenericJobErrorCode.FAILED, e.getMessage());
    }
  }

  private OpenAISettings getSettings() {
    return settingsProvider.getSettings(groupId, siteId);
  }

}
