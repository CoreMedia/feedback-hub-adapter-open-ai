package com.coremedia.labs.plugins.feedbackhub.openai.provider;

import com.coremedia.feedbackhub.adapter.FeedbackHubException;
import com.coremedia.feedbackhub.provider.FeedbackProvider;
import com.coremedia.feedbackhub.provider.FeedbackProviderFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAIFeedbackHubErrorCode;
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

    return new OpenAIFeedbackProvider();
  }
}
