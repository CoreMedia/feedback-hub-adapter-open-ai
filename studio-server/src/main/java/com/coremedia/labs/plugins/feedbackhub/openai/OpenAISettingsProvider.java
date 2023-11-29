package com.coremedia.labs.plugins.feedbackhub.openai;

import com.coremedia.feedbackhub.settings.FeedbackSettingsProvider;

public class OpenAISettingsProvider {

  private final FeedbackSettingsProvider feedbackSettingsProvider;

  private final String factoryId;

  public OpenAISettingsProvider(FeedbackSettingsProvider feedbackSettingsProvider, String factoryId) {
    this.factoryId = factoryId;
    this.feedbackSettingsProvider = feedbackSettingsProvider;
  }

  public OpenAISettings getSettings(String groupId, String siteId) {
    return feedbackSettingsProvider.getSettings(OpenAISettings.class, factoryId, groupId, siteId);
  }

}
