package com.coremedia.labs.plugins.feedbackhub.openai;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.multisite.SitesService;
import com.coremedia.cms.common.plugins.beans_for_plugins.CommonBeansForPluginsConfiguration;
import com.coremedia.feedbackhub.FeedbackHubConfigurationProperties;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.ApplyTextToContentJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.GenerateTextJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.provider.OpenAIFeedbackProviderFactory;
import edu.umd.cs.findbugs.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({CommonBeansForPluginsConfiguration.class})
public class OpenAIConfiguration {

  @Bean
  public OpenAIFeedbackProviderFactory openAIFeedbackProviderFactory() {
    return new OpenAIFeedbackProviderFactory();
  }

  @Bean
  public FeedbackSettingsProvider openAIFeedbackSettingsProvider(@NonNull SitesService sitesService, @NonNull CapConnection capConnection) {
    return new FeedbackSettingsProvider(capConnection,
            sitesService,
            new FeedbackHubConfigurationProperties.Bindings(),
            OpenAISettings.class,
            OpenAIFeedbackProviderFactory.TYPE);
  }

  @Bean
  public GenerateTextJobFactory generateTextJobFactory(@NonNull SitesService sitesService, @NonNull FeedbackSettingsProvider openAIFeedbackSettingsProvider) {
    return new GenerateTextJobFactory(sitesService, openAIFeedbackSettingsProvider);
  }

  @Bean
  public ApplyTextToContentJobFactory applyTextToContentJobFactory(@NonNull CapConnection capConnection) {
    return new ApplyTextToContentJobFactory(capConnection);
  }
}
