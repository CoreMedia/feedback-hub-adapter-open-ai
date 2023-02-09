import CopyResourceBundleProperties
  from "@coremedia/studio-client.main.editor-components/configuration/CopyResourceBundleProperties";
import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import FeedbackHub_properties
  from "@coremedia/studio-client.main.feedback-hub-editor-components/FeedbackHub_properties";
import feedbackService from "@coremedia/studio-client.main.feedback-hub-editor-components/feedbackService";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import FeedbackHubOpenAIStudioPlugin_properties from "./FeedbackHubOpenAIStudioPlugin_properties";
import OpenAIGeneralPanel from "./custom/itemtypes/OpenAIGeneralPanel";
import NewContentMenu from "@coremedia/studio-client.main.editor-components/sdk/newcontent/NewContentMenu";
import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import Component from "@jangaroo/ext-ts/Component";
import OpenAICreatePicturesMenuItem from "./custom/newcontent/OpenAICreatePicturesMenuItem";
import Separator from "@jangaroo/ext-ts/menu/Separator";
import QuickCreateLinklistMenu
  from "@coremedia/studio-client.main.editor-components/sdk/quickcreate/QuickCreateLinklistMenu";
import AddOpenAIQuickCreateItemPlugin from "./custom/plugins/AddOpenAIQuickCreateItemPlugin";

interface FeedbackHubOpenAIStudioPluginConfig extends Config<StudioPlugin> {
}

class FeedbackHubOpenAIStudioPlugin extends StudioPlugin {
  declare Config: FeedbackHubOpenAIStudioPluginConfig;

  constructor(config: Config<FeedbackHubOpenAIStudioPlugin> = null) {
    super((() => {
      this.#__initialize__(config);
      return ConfigUtils.apply(Config(FeedbackHubOpenAIStudioPlugin, {

        rules: [
          Config(NewContentMenu, {
            plugins: [
              Config(AddItemsPlugin, {
                items: [
                  Config(Separator, { itemId: "openAiCreatePicturesMenuSeparator" }),
                  Config(OpenAICreatePicturesMenuItem)
                ],
                before: [
                  Config(Component, { itemId: NewContentMenu.DYNAMIC_SEPARATOR }),
                ],
              })
            ]
          }),

          Config(QuickCreateLinklistMenu, {
            plugins: [
              Config(AddOpenAIQuickCreateItemPlugin)
            ]
          })
        ],

        configuration: [
          new CopyResourceBundleProperties({
            destination: resourceManager.getResourceBundle(null, FeedbackHub_properties),
            source: resourceManager.getResourceBundle(null, FeedbackHubOpenAIStudioPlugin_properties),
          }),
        ],

      }), config);
    })());
  }

  #__initialize__(config: Config<FeedbackHubOpenAIStudioPlugin>): void {
    feedbackService._.registerFeedbackItemPanel("OpenAiGeneralFeedbackItem", Config(OpenAIGeneralPanel));
  }
}

export default FeedbackHubOpenAIStudioPlugin;
