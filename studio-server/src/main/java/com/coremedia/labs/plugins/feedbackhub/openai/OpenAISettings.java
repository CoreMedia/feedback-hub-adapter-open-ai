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
  Integer getMaxTokens();
  @NonNull
  Integer getTemperature();
  @NonNull
  String getLanguageModel();

}
