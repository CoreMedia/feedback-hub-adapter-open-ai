import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NestedRulesPlugin from "@coremedia/studio-client.ext.ui-components/plugins/NestedRulesPlugin";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import QuickCreateLinklistMenu
  from "@coremedia/studio-client.main.editor-components/sdk/quickcreate/QuickCreateLinklistMenu";
import { as, bind } from "@jangaroo/runtime";
import Container from "@jangaroo/ext-ts/container/Container";
import OpenAICreatePicturesMenuItem from "../newcontent/OpenAICreatePicturesMenuItem";
import Separator from "@jangaroo/ext-ts/menu/Separator";
import QuickCreateSettings_properties
  from "@coremedia/studio-client.main.editor-components/sdk/quickcreate/QuickCreateSettings_properties";

interface AddOpenAIQuickCreateItemPluginConfig extends Config<NestedRulesPlugin> {

}

class AddOpenAIQuickCreateItemPlugin extends NestedRulesPlugin {

  declare Config: AddOpenAIQuickCreateItemPluginConfig;

  #quickCreateMenu:QuickCreateLinklistMenu;

  constructor(config: Config<AddOpenAIQuickCreateItemPlugin> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;

    this$.#quickCreateMenu = as(config.cmp, QuickCreateLinklistMenu);
    if (!this$.#quickCreateMenu) {
      throw new Error("AddQuickCreateItemPlugin can only applied to QuickCreateLinklistMenu!");
    }

    super(ConfigUtils.apply(Config(AddOpenAIQuickCreateItemPlugin, {
      rules: [
        Config(Menu, {
          itemId: "createFromLinkListMenu",
          plugins: [
            Config(AddItemsPlugin, {
              onlyIf: bind(this$, this$.isApplicable),
              items: [
                Config(OpenAICreatePicturesMenuItem, {
                  bindTo: this$.#quickCreateMenu.bindTo,
                  propertyName: this$.#quickCreateMenu.propertyName
                }),
                Config(Separator)
              ]
            })
          ]
        })
      ]
    }), config));
  }

  /**
   * Compute if plugin should be applied or not by checking the configured list of content types.
   * If 'CMPicture' is part of the list, also add the plugin.
   *
   * @param cmp
   */
  isApplicable(cmp:Container):boolean {
    let isApplicable = false;
    const contentTypes = this.#quickCreateMenu.contentTypes || QuickCreateSettings_properties.default_link_list_contentTypes;
    if (contentTypes) {
      isApplicable = contentTypes.split(",").indexOf("CMPicture") >= 0;
    }
    return isApplicable;
  }

}

export default AddOpenAIQuickCreateItemPlugin;
