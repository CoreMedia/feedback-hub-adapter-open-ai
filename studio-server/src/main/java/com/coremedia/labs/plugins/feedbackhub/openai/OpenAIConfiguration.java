package com.coremedia.labs.plugins.feedbackhub.openai;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cms.common.plugins.beans_for_plugins.CommonBeansForPluginsConfiguration;
import com.coremedia.feedbackhub.beans_for_plugins.FeedbackHubBeansForPluginsConfiguration;
import com.coremedia.feedbackhub.settings.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.ApplyTextToContentJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.GenerateTextJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.provider.OpenAIFeedbackProviderFactory;
import edu.umd.cs.findbugs.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({CommonBeansForPluginsConfiguration.class, FeedbackHubBeansForPluginsConfiguration.class})
public class OpenAIConfiguration {

  @Bean
  public OpenAIFeedbackProviderFactory openAIFeedbackProviderFactory() {
    return new OpenAIFeedbackProviderFactory();
  }

  // --- OpenAI Services ---

  // --- Job Factories ---
  @Bean
  public GenerateTextJobFactory generateTextJobFactory(@NonNull FeedbackSettingsProvider settingsProvider) {
    return new GenerateTextJobFactory(settingsProvider);
  }

  @Bean
  public ApplyTextToContentJobFactory applyTextToContentJobFactory(@NonNull CapConnection capConnection,
                                                                   @NonNull FeedbackSettingsProvider settingsProvider) {
    return new ApplyTextToContentJobFactory(capConnection, settingsProvider);
  }
}
