package com.coremedia.labs.plugins.feedbackhub.openai;

import edu.umd.cs.findbugs.annotations.NonNull;

/**
 *
 */
public interface OpenAISettings {

  @NonNull
  String getApiKey();
  Integer getTimeoutInSeconds();
  @NonNull
  String getLanguageModel();

}
