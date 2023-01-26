package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.multisite.SitesService;
import com.coremedia.labs.plugins.feedbackhub.openai.FeedbackSettingsProvider;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobFactory;
import edu.umd.cs.findbugs.annotations.NonNull;

public class GenerateTextJobFactory implements JobFactory {

  private final SitesService sitesService;

  private final FeedbackSettingsProvider settingsProvider;


  public GenerateTextJobFactory(SitesService sitesService, FeedbackSettingsProvider settingsProvider) {
    this.sitesService = sitesService;
    this.settingsProvider = settingsProvider;
  }

  @Override
  public boolean accepts(@NonNull String jobType) {
    return "generateText".equals(jobType);
  }

  @NonNull
  @Override
  public Job createJob() {
    return new GenerateTextJob(settingsProvider, sitesService);
  }
}
