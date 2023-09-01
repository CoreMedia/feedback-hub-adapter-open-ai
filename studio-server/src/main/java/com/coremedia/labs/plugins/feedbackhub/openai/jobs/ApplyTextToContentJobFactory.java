package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.feedbackhub.settings.FeedbackSettingsProvider;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobFactory;
import edu.umd.cs.findbugs.annotations.NonNull;

public class ApplyTextToContentJobFactory implements JobFactory {

  private final CapConnection capConnection;
  private final FeedbackSettingsProvider settingsProvider;


  public ApplyTextToContentJobFactory(CapConnection capConnection, FeedbackSettingsProvider openAIFeedbackSettingsProvider) {
    this.capConnection = capConnection;
    this.settingsProvider = openAIFeedbackSettingsProvider;
  }

  @Override
  public boolean accepts(@NonNull String jobType) {
    return "OpenAIApplyTextToContent".equals(jobType);
  }

  @NonNull
  @Override
  public Job createJob() {
    return new ApplyTextToContentJob(capConnection, settingsProvider);
  }
}
