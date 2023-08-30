package com.coremedia.labs.plugins.feedbackhub.openai.provider;

import com.coremedia.feedbackhub.adapter.FeedbackContext;
import com.coremedia.feedbackhub.items.FeedbackItem;
import com.coremedia.feedbackhub.items.FeedbackItemFactory;
import com.coremedia.feedbackhub.items.FeedbackLinkFeedbackItem;
import com.coremedia.feedbackhub.provider.FeedbackProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.items.OpenAIGeneralFeedbackItem;
import edu.umd.cs.findbugs.annotations.DefaultAnnotation;
import edu.umd.cs.findbugs.annotations.NonNull;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import static com.coremedia.labs.plugins.feedbackhub.openai.OpenAIFeedbackCollections.GENERAL;

/**
 *
 */
@DefaultAnnotation(NonNull.class)
public class OpenAIFeedbackProvider implements FeedbackProvider {

  @Override
  public CompletionStage<Collection<FeedbackItem>> provideFeedback(FeedbackContext context) {
    List<FeedbackItem> items = new ArrayList<>();

    FeedbackLinkFeedbackItem githubLink = FeedbackItemFactory.createFeedbackLink("https://chat.openai.com/");
    items.add(githubLink);

    OpenAIGeneralFeedbackItem openAIGeneralFeedbackItem = OpenAIGeneralFeedbackItem.builder()
            .withCollection(GENERAL)
            .build();
    items.add(openAIGeneralFeedbackItem);

    return CompletableFuture.completedFuture(items);
  }
}
