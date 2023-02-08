package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.labs.plugins.feedbackhub.openai.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIImageService;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobFactory;
import org.jetbrains.annotations.NotNull;

public class GenerateImagesJobFactory implements JobFactory {

  private final FeedbackSettingsProvider settingsProvider;
  private final OpenAIImageService imageService;

  public GenerateImagesJobFactory(FeedbackSettingsProvider settingsProvider, OpenAIImageService openAIImageService) {
    this.settingsProvider = settingsProvider;
    this.imageService = openAIImageService;
  }

  @Override
  public boolean accepts(@NotNull String jobType) {
    return "OpenAIGenerateImagesJob".equals(jobType);
  }

  @NotNull
  @Override
  public Job createJob() {
    return new GenerateImagesJob(settingsProvider, imageService);
  }
}
