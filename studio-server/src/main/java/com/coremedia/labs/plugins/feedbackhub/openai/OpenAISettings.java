package com.coremedia.labs.plugins.feedbackhub.openai;

import edu.umd.cs.findbugs.annotations.NonNull;

/**
 * Settings interface for OpenAI Feedback Hub.
 *
 * Example:
 * <pre>
 *   &lt;Struct&gt;
 *   &lt;StringProperty Name=&quot;apiKey&quot;&gt;YOUR API KEY&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;languageModel&quot;&gt;text-davinci-003&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;textProperty&quot;&gt;detailText&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;titleProperty&quot;&gt;title&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;keywordsProperty&quot;&gt;keywords&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;headlineProperty&quot;&gt;htmlTitle&lt;/StringProperty&gt;
 *   &lt;StringProperty Name=&quot;metadataProperty&quot;&gt;htmlDescription&lt;/StringProperty&gt;
 *   &lt;IntProperty Name=&quot;maxTokens&quot;&gt;1000&lt;/IntProperty&gt;
 *   &lt;IntProperty Name=&quot;temperature&quot;&gt;30&lt;/IntProperty&gt;
 *   &lt;IntProperty Name=&quot;timeoutInSeconds&quot;&gt;30&lt;/IntProperty&gt;
 * &lt;/Struct&gt;
 * </pre>
 */
public interface OpenAISettings {

  @NonNull
  String getApiKey();

  Integer getTimeoutInSeconds();

  Integer getTemperature();

  Integer getMaxTokens();

  @NonNull
  String getLanguageModel();

  String getTextProperty();
  String getTitleProperty();
  String getKeywordsProperty();
  String getHeadlineProperty();
  String getMetadataProperty();
}
