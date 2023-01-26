package com.coremedia.labs.plugins.feedbackhub.openai.items;

import com.coremedia.feedbackhub.items.FeedbackItemBuilder;

public class OpenAIGeneralFeedbackItemBuilder extends FeedbackItemBuilder<OpenAIGeneralFeedbackItemBuilder> {

  public OpenAIGeneralFeedbackItem build() {
    return new OpenAIGeneralFeedbackItem(this.collection);
  }
}
