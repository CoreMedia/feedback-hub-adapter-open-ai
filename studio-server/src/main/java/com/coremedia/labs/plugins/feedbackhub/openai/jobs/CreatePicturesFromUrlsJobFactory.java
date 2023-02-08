package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.content.ContentRepository;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobFactory;
import org.jetbrains.annotations.NotNull;

public class CreatePicturesFromUrlsJobFactory implements JobFactory {

  private ContentRepository contentRepository;

  public CreatePicturesFromUrlsJobFactory(ContentRepository contentRepository) {
    this.contentRepository = contentRepository;
  }

  @Override
  public boolean accepts(@NotNull String jobType) {
    return "OpenAICreatPicturesFromUrlsJob".equals(jobType);
  }

  @NotNull
  @Override
  public Job createJob() {
    return new CreatePicturesFromUrlsJob(contentRepository);
  }
}
