package com.coremedia.labs.plugins.feedbackhub.openai.api;

import com.theokanning.openai.service.OpenAiService;

import java.time.Duration;

public final class OpenAIClientProvider {

  private static OpenAiService client = null;

  private OpenAIClientProvider() {}

  public static OpenAiService getClient(String apiKey, Duration timeout) {
    if (client != null) {
      return client;
    }
    client = new OpenAiService(apiKey, timeout);
    return client;
  }
}
