package com.coremedia.labs.plugins.feedbackhub.openai;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.multisite.Site;
import com.coremedia.cap.multisite.SitesService;
import com.coremedia.feedbackhub.Binding;
import com.coremedia.feedbackhub.BindingsLookup;
import com.coremedia.feedbackhub.FeedbackHubConfigurationProperties;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;

import java.util.Optional;

/**
 * Utility class for feedback integrations that are implemented as a plugin
 * and have to access the configuration settings for the adapter/provider.
 */
public class FeedbackSettingsProvider {

  private final CapConnection capConnection;
  private final SitesService sitesService;
  private final FeedbackHubConfigurationProperties.Bindings bindingProperties;
  private final String factoryId;
  private final Class clazz;

  public FeedbackSettingsProvider(@NonNull CapConnection capConnection,
                                  @NonNull SitesService sitesService,
                                  @NonNull FeedbackHubConfigurationProperties.Bindings config,
                                  @NonNull Class clazz,
                                  @NonNull String factoryId) {
    this.capConnection = capConnection;
    this.sitesService = sitesService;
    this.bindingProperties = config;
    this.clazz = clazz;
    this.factoryId = factoryId;
  }

  public <T> T getSettings(@NonNull String groupId, @Nullable String siteId) {
    Site site = sitesService.getSite(siteId);
    BindingsLookup bindingsLookup = new BindingsLookup(capConnection.getContentRepository(), sitesService, bindingProperties);

    Optional<Binding> optionalBinding = bindingsLookup.getBindings()
            .stream()
            .filter(binding -> binding.getGroupId().equals(groupId))
            .filter(binding -> isBindingEnabled(site, binding))
            .filter(binding -> binding.getFactoryId().equals(factoryId))
            .findFirst();

    if (optionalBinding.isPresent()) {
      return (T) optionalBinding.get().getSettings(clazz);
    }
    throw new IllegalArgumentException("No configuration found for factoryId " + factoryId + " and site " + siteId);
  }

  private static boolean isBindingEnabled(Site site, Binding binding) {
    return binding.isEnabledGlobally() || (site != null && binding.isEnabledLocally(site));
  }
}
