package com.coremedia.labs.plugins.feedbackhub.openai.items;

import com.coremedia.feedbackhub.items.FeedbackItem;


public class OpenAIGeneralFeedbackItem implements FeedbackItem {

  private final String collection;


  public OpenAIGeneralFeedbackItem(String collection) {
    this.collection = collection;
  }

  @Override
  public String getType() {
    return "OpenAiGeneralFeedbackItem";
  }

  @Override
  public String getCollection() {
    return collection;
  }

  public static OpenAIGeneralFeedbackItemBuilder builder() {
    return new OpenAIGeneralFeedbackItemBuilder();
  }


}
