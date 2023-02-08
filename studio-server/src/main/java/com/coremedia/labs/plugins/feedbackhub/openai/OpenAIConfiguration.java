package com.coremedia.labs.plugins.feedbackhub.openai;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.multisite.SitesService;
import com.coremedia.cms.common.plugins.beans_for_plugins.CommonBeansForPluginsConfiguration;
import com.coremedia.feedbackhub.FeedbackHubConfigurationProperties;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIImageService;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.ApplyTextToContentJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.CreatePicturesFromUrlsJobFactory;
import com.coremedia.labs.plugins.feedbackhub.openai.jobs.GenerateImagesJobFactory;
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


  // --- OpenAI Services ---
  @Bean
  public OpenAIImageService openAIImageService() {
    return new OpenAIImageService();
  }


  // --- Job Factories ---
  @Bean
  public GenerateTextJobFactory generateTextJobFactory(@NonNull FeedbackSettingsProvider openAIFeedbackSettingsProvider) {
    return new GenerateTextJobFactory(openAIFeedbackSettingsProvider);
  }
  @Bean
  public ApplyTextToContentJobFactory applyTextToContentJobFactory(@NonNull CapConnection capConnection) {
    return new ApplyTextToContentJobFactory(capConnection);
  }

  @Bean
  public GenerateImagesJobFactory generateImagesJobFactory(@NonNull FeedbackSettingsProvider openAIFeedbackSettingsProvider,
                                                           @NonNull OpenAIImageService openAIImageService) {
    return new GenerateImagesJobFactory(openAIFeedbackSettingsProvider, openAIImageService);
  }

  @Bean
  public CreatePicturesFromUrlsJobFactory createPicturesFromUrlsJobFactory(@NonNull CapConnection capConnection) {
    return new CreatePicturesFromUrlsJobFactory(capConnection.getContentRepository());
  }

}
