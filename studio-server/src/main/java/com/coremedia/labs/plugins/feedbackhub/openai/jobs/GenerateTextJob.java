package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.multisite.SitesService;
import com.coremedia.labs.plugins.feedbackhub.openai.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIClientProvider;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.google.gson.annotations.SerializedName;
import com.theokanning.openai.OpenAiService;
import com.theokanning.openai.completion.CompletionRequest;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

public class GenerateTextJob implements Job {
  private static final Logger LOG = LoggerFactory.getLogger(GenerateTextJob.class);


  private String prompt;
  private String contentId;
  private String siteId;
  private String groupId;
  private final SitesService sitesService;

  private FeedbackSettingsProvider settingsProvider;

  public GenerateTextJob(FeedbackSettingsProvider settingsProvider, SitesService sitesService) {
    this.settingsProvider = settingsProvider;
    this.sitesService = sitesService;
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

  @Nullable
  @Override
  public Object call(@NonNull JobContext jobContext) throws JobExecutionException {
    try {
      OpenAISettings settings = getSettings();

      OpenAiService client = OpenAIClientProvider.getClient(settings.getApiKey(), Duration.ofSeconds(settings.getTimeoutInSeconds()));
      double temperature = settings.getTemperature().doubleValue() / 10;
      CompletionRequest request = CompletionRequest.builder()
              .prompt(prompt)
              .model(settings.getLanguageModel())
              .maxTokens(settings.getMaxTokens())
              .temperature(temperature)
              .echo(false)
              .build();
      return client.createCompletion(request).getChoices().stream().findFirst().orElseThrow().getText();
    } catch (Exception e) {
      LOG.error("Failed to generate text for given prompt: {} on content {}: {}", prompt, contentId, e.getMessage());
      throw new JobExecutionException(GenericJobErrorCode.FAILED, e.getMessage());
    }
  }
  private OpenAISettings getSettings() {
    return settingsProvider.getSettings(groupId, siteId);
  }

}
