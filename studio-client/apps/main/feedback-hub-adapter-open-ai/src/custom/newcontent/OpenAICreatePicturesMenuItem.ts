import Config from "@jangaroo/runtime/Config";
import Item from "@jangaroo/ext-ts/menu/Item";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import OpenAICreatePicturesDialog from "./OpenAICreatePicturesDialog";
import { bind } from "@jangaroo/runtime";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import FeedbackHubOpenAIStudioPlugin_properties from "../../FeedbackHubOpenAIStudioPlugin_properties";

interface OpenAICreatePicturesMenuItemConfig extends Config<Item>, Partial<Pick<OpenAICreatePicturesMenuItem,
  "bindTo" |
  "propertyName"
>> {}

class OpenAICreatePicturesMenuItem extends Item {

  declare Config: OpenAICreatePicturesMenuItemConfig;

  constructor(config: Config<OpenAICreatePicturesMenuItem> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenAICreatePicturesMenuItem, {
      itemId: "openAICreatePictures",
      baseAction: new OpenDialogAction({
        actionId: "OpenAICreatePicturesDialog",
        iconCls: CoreIcons_properties.create_type_picture,
        toggleDialog: true,
        text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesMenuItem_text,
        dialog: Config(OpenAICreatePicturesDialog, { positionFun: bind(this$, this$.getPosition) }),
      }),

    }), config));
  }

  /**
   * Contains the active content.
   */
  bindTo: ValueExpression = null;

  /** The content property name of the list to bind the newly created content to. */
  propertyName: string = null;

}

export default OpenAICreatePicturesMenuItem;
