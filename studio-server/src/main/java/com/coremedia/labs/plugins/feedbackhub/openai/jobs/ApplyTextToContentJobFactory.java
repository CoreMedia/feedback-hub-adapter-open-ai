package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettingsProvider;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobFactory;
import edu.umd.cs.findbugs.annotations.NonNull;

public class ApplyTextToContentJobFactory implements JobFactory {

  private final CapConnection capConnection;
  private final OpenAISettingsProvider openAIFeedbackSettingsProvider;


  public ApplyTextToContentJobFactory(CapConnection capConnection, OpenAISettingsProvider openAIFeedbackSettingsProvider) {
    this.capConnection = capConnection;
    this.openAIFeedbackSettingsProvider = openAIFeedbackSettingsProvider;
  }

  @Override
  public boolean accepts(@NonNull String jobType) {
    return "OpenAIApplyTextToContent".equals(jobType);
  }

  @NonNull
  @Override
  public Job createJob() {
    return new ApplyTextToContentJob(capConnection, openAIFeedbackSettingsProvider);
  }
}
