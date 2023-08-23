package com.coremedia.labs.plugins.feedbackhub.openai.provider;

import com.coremedia.feedbackhub.adapter.FeedbackHubException;
import com.coremedia.feedbackhub.provider.FeedbackProvider;
import com.coremedia.feedbackhub.provider.FeedbackProviderFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAIFeedbackHubErrorCode;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import org.apache.commons.lang3.StringUtils;

public class OpenAIFeedbackProviderFactory implements FeedbackProviderFactory<OpenAISettings> {

  public static final String TYPE = "OpenAI";

  public OpenAIFeedbackProviderFactory() {
  }

  @Override
  public String getId() {
    return TYPE;
  }

  @Override
  public FeedbackProvider create(OpenAISettings settings) {
    String apiKey = settings.getApiKey();
    if (StringUtils.isEmpty(apiKey)) {
      throw new FeedbackHubException("settings must provide an apiKey", OpenAIFeedbackHubErrorCode.API_KEY_NOT_SET);
    }

    String languageModel = settings.getLanguageModel();
    if (StringUtils.isEmpty(languageModel)) {
      throw new FeedbackHubException("settings must provide the language model", OpenAIFeedbackHubErrorCode.LANGUAGE_MODEL_NOT_SET);
    }

    return new OpenAIFeedbackProvider();
  }
}
