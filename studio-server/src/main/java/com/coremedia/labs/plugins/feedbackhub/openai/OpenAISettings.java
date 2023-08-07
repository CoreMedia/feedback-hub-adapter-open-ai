package com.coremedia.labs.plugins.feedbackhub.openai;

import edu.umd.cs.findbugs.annotations.NonNull;

/**
 * Settings interface for OpenAI Feedback Hub.
 */
public interface OpenAISettings {

  @NonNull
  String getApiKey();

  Integer getTimeoutInSeconds();

  @NonNull
  String getLanguageModel();

  @NonNull
  int getNumberOfImagesToGenerate();
}
