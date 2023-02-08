import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import StudioDialog from "@coremedia/studio-client.ext.base-components/dialogs/StudioDialog";
import WindowSkin from "@coremedia/studio-client.ext.ui-components/skins/WindowSkin";
import { AnyFunction } from "@jangaroo/runtime/types";
import Container from "@jangaroo/ext-ts/container/Container";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import Button from "@jangaroo/ext-ts/button/Button";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import BaseField from "@jangaroo/ext-ts/form/field/Base";
import ExtEvent from "@jangaroo/ext-ts/event/Event";
import VerticalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/VerticalSpacingPlugin";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import { bind } from "@jangaroo/runtime";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";
import DataView from "@jangaroo/ext-ts/view/View";
import XTemplate from "@jangaroo/ext-ts/XTemplate";
import BEMBlock from "@coremedia/studio-client.ext.ui-components/models/bem/BEMBlock";
import BEMElement from "@coremedia/studio-client.ext.ui-components/models/bem/BEMElement";
import ArrayUtils from "@coremedia/studio-client.client-core/util/ArrayUtils";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import OpenAIService from "../utils/OpenAIService";
import BindSelectionPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindSelectionPlugin";
import beanFactory from "@coremedia/studio-client.client-core/data/beanFactory";
import BindListPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindListPlugin";
import DataField from "@jangaroo/ext-ts/data/field/Field";
import SliderField from "@jangaroo/ext-ts/slider/Single";
import ContentCreationUtil from "@coremedia/studio-client.main.editor-components/sdk/util/ContentCreationUtil";
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Bean from "@coremedia/studio-client.client-core/data/Bean";
import Component from "@jangaroo/ext-ts/Component";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import Fill from "@jangaroo/ext-ts/toolbar/Fill";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import StatefulCheckbox from "@coremedia/studio-client.ext.ui-components/components/StatefulCheckbox";
import SwitchingContainer from "@coremedia/studio-client.ext.ui-components/components/SwitchingContainer";
import EmptyContainer from "@coremedia/studio-client.ext.ui-components/components/EmptyContainer";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import DisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/DisplayFieldSkin";
import ToolbarSkin from "@coremedia/studio-client.ext.ui-components/skins/ToolbarSkin";
import Labelable from "@jangaroo/ext-ts/form/Labelable";
import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import FeedbackHubOpenAIStudioPlugin_properties from "../../FeedbackHubOpenAIStudioPlugin_properties";

interface OpenAICreatePicturesDialogConfig extends Config<StudioDialog>, Partial<Pick<OpenAICreatePicturesDialog,
  "positionFun"
>> {}

class OpenAICreatePicturesDialog extends StudioDialog {

  declare Config: OpenAICreatePicturesDialogConfig;

  positionFun: AnyFunction = null;

  private promptExpression: ValueExpression;
  private selectedImagesExpression: ValueExpression;
  private generatedImagesExpression: ValueExpression;
  private activeStateExpression: ValueExpression;
  private thumbnailZoomExpression: ValueExpression;
  private openInTabExpression: ValueExpression;

  static readonly BLOCK_CLASS_NAME: string = "openai-create-picture-dialog";

  static readonly DEFAULT_STATE: string = "default-state";
  static readonly EMPTY_STATE: string = "empty-state";
  static readonly IMAGES_LOADING_STATE: string = "images-loading-state";
  static readonly IMAGES_LOADED_STATE: string = "images-loaded-state";
  static readonly CONTENT_CREATION_IN_PROGRESS_STATE: string = "content-creation-in-progress-state";
  static readonly CONTENT_CREATION_SUCCESS_STATE: string = "content-creation-success-state";
  static readonly CONTENT_CREATION_ERROR_STATE: string = "content-creation-error-state";

  static readonly THUMBNAILS_DATA_VIEW_ITEM_ID: string = "thumbnailsDataView";
  static readonly THUMBNAILS_BLOCK: BEMBlock = new BEMBlock("openai-thumbnails");
  static readonly THUMBNAILS_ELEMENT_ITEM: BEMElement = OpenAICreatePicturesDialog.THUMBNAILS_BLOCK.createElement("item");

  constructor(config: Config<OpenAICreatePicturesDialog> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenAICreatePicturesDialog, {
      title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_title,
      id: "openAICreatePicturesDialog",
      iconCls: CoreIcons_properties.create_type_picture,
      resizable: true,
      stateful: true,
      stateId: "openAICreatePictureDialogState",
      height: 600,
      width: 550,
      minWidth: 350,
      bodyPadding: "12 12 0 12",
      x: config.positionFun ? config.positionFun()[0] : 113,
      y: config.positionFun ? config.positionFun()[1] : 84,
      constrainHeader: true,
      ui: WindowSkin.GRID_200.getSkin(),
      items: [

        // Input fields
        Config(Container, {
          items: [
            Config(TextField, {
              flex: 1,
              allowBlank: false,
              fieldLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_prompt_fieldLabel,
              emptyText: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_prompt_emptyText,
              plugins: [
                Config(BindPropertyPlugin, {
                  bindTo: this$.getPromptExpression(),
                  bidirectional: true,
                }),
              ],
              listeners: {
                "specialkey": (field: BaseField, e: ExtEvent) => {
                  if (e.getKey() === ExtEvent.ENTER) {
                    this$.generateImages();
                  }
                }
              },
            }),
            Config(Container, { width: 6 }),
            Config(Button, {
              formBind: true,
              ui: ButtonSkin.MATERIAL_PRIMARY.getSkin(),
              handler: bind(this$, this$.generateImages),
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_generateImagesBtn_text,
              plugins: [
                Config(BindPropertyPlugin, {
                  componentProperty: "disabled",
                  bindTo: this$.getPromptExpression(),
                  transformer: (prompt) => {return !prompt || prompt === "";}
                })
              ]
            }),
          ],
          defaultType: Labelable["xtype"],
          defaults: Config<Labelable>({
            labelSeparator: "",
            labelAlign: "top",
          }),
          layout: Config(HBoxLayout, {
            align: "end",
            pack: "start",
          })
        }),

        Config(SwitchingContainer, {
          flex: 1,
          activeItemValueExpression: this$.getActiveStateExpression(),
          items: [

            // Default state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.DEFAULT_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.DEFAULT_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_defaultState_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_defaultState_text,
            }),

            // Loading images state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.IMAGES_LOADING_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.IMAGES_LOADING_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_imagesLoading_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_imagesLoading_text,
            }),

            // Images loaded state
            Config(Panel, {
              itemId: OpenAICreatePicturesDialog.IMAGES_LOADED_STATE,
              scrollable: "vertical",
              items: [
                Config(DataView, {
                  itemId: OpenAICreatePicturesDialog.THUMBNAILS_DATA_VIEW_ITEM_ID,
                  itemSelector: OpenAICreatePicturesDialog.THUMBNAILS_ELEMENT_ITEM.getCSSSelector(),
                  tpl: this$.getThumbnailTemplate(),
                  focusable: false,
                  tabIndex: -1,
                  scrollable: "vertical",
                  multiSelect: true,
                  plugins: [
                    Config(BindListPlugin, {
                      bindTo: this$.getGeneratedImagesExpression(),
                      fields: [
                        Config(DataField, { name: "url" }),
                        Config(DataField, { name: "zoom" })
                      ]
                    }),
                    Config(BindSelectionPlugin, {
                      selectedValues: this$.getSelectedImagesExpression()
                    })
                  ]
                }),
              ],
              tbar: Config(Toolbar, {
                ui: ToolbarSkin.LIGHT.getSkin(),
                items: [
                  Config(DisplayField, {
                    value: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_results_title,
                    ui: DisplayFieldSkin.BOLD.getSkin()
                  }),
                  Config(Fill),
                  Config(SliderField, {
                    minValue: 50,
                    maxValue: 250,
                    increment: 10,
                    width: 100,
                    useTips: false,
                    plugins: [
                      Config(BindPropertyPlugin, {
                        bidirectional: true,
                        bindTo: this$.getThumbnailZoomExpression(),
                      })
                    ]
                  })
                ]
              })
            }),

            // Empty state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.EMPTY_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.EMPTY_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_emptyState_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_emptyState_text,
            }),

            // Creating content state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.CONTENT_CREATION_IN_PROGRESS_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.CONTENT_CREATION_IN_PROGRESS_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_creatingContentState_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_creatingContentState_text,
            }),

            // Content created state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.CONTENT_CREATION_SUCCESS_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.CONTENT_CREATION_SUCCESS_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_contentCreationSuccessState_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_contentCreationSuccessState_text,
            }),

            // Content creation error state
            Config(EmptyContainer, {
              itemId: OpenAICreatePicturesDialog.CONTENT_CREATION_ERROR_STATE,
              iconElementName: `${OpenAICreatePicturesDialog.CONTENT_CREATION_ERROR_STATE}-icon`,
              bemBlockName: OpenAICreatePicturesDialog.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_contentCreationErrorState_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_contentCreationErrorState_text,
            }),

          ]
        }),
      ],
      layout: Config(VBoxLayout, { align: "stretch" }),
      plugins: [
        Config(VerticalSpacingPlugin),
      ],
      fbar: Config(Toolbar, {
        focusableContainer: false,
        items: [
          Config(Component, { width: 0 }),
          Config(StatefulCheckbox, {
            itemId: "openInTabCheckBox",
            boxLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_openInTab_label,
            plugins: [
              Config(BindPropertyPlugin, {
                bidirectional: true,
                bindTo: this$.getOpenInTabExpression(),
              }),
            ],
          }),

          Config(Fill),
          Config(Button, {
            itemId: "createBtn",
            ui: ButtonSkin.FOOTER_PRIMARY.getSkin(),
            scale: "small",
            text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_createPicturesDialog_createBtn_text,
            handler: bind(this$, this$.handleCreate),
            plugins: [
              Config(BindPropertyPlugin, {
                componentProperty: "disabled",
                bindTo: this$.getActiveStateExpression(),
                transformer: bind(this$, this$.calculateCreateBtnDisabledState)
              }),
            ]
          }),
          Config(Button, {
            itemId: "cancelBtn",
            ui: ButtonSkin.FOOTER_SECONDARY.getSkin(),
            scale: "small",
            text: Editor_properties.dialog_defaultCancelButton_text,
            handler: bind(this$, this$.close),
          }),
        ],
      }),
    }), config));
  }

  getPromptExpression(): ValueExpression {
    if (!this.promptExpression) {
      this.promptExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.promptExpression;
  }

  getSelectedImagesExpression(): ValueExpression {
    if (!this.selectedImagesExpression) {
      this.selectedImagesExpression = ValueExpressionFactory.createFromValue([]);
    }
    return this.selectedImagesExpression;
  }

  getGeneratedImagesExpression(): ValueExpression {
    if (!this.generatedImagesExpression) {
      this.generatedImagesExpression = ValueExpressionFactory.createFromValue([]);
    }
    return this.generatedImagesExpression;
  }

  getOpenInTabExpression(): ValueExpression {
    if (!this.openInTabExpression) {
      this.openInTabExpression = ValueExpressionFactory.createFromValue(true);
    }
    return this.openInTabExpression;
  }

  getActiveStateExpression(): ValueExpression {
    if (!this.activeStateExpression) {
      this.activeStateExpression = ValueExpressionFactory.createFromValue(OpenAICreatePicturesDialog.DEFAULT_STATE);
    }
    return this.activeStateExpression;
  }

  getThumbnailZoomExpression(): ValueExpression {
    if (!this.thumbnailZoomExpression) {
      this.thumbnailZoomExpression = ValueExpressionFactory.createFromValue(100);
      this.thumbnailZoomExpression.addChangeListener(bind(this, this.thumbnailZoomChanged));
    }
    return this.thumbnailZoomExpression;
  }

  generateImages(): void {
    const promt = this.getPromptExpression().getValue();
    if (promt) {

      this.getActiveStateExpression().setValue(OpenAICreatePicturesDialog.IMAGES_LOADING_STATE);

      OpenAIService.generateImages(promt).then((urls) => {
        const currentZoom = this.getThumbnailZoomExpression().getValue();
        const imgUrlBeans = urls.map(url => beanFactory._.createLocalBean({ url: url, zoom: currentZoom }));
        this.getGeneratedImagesExpression().setValue(imgUrlBeans);

        // Update state
        this.getActiveStateExpression().setValue(OpenAICreatePicturesDialog.IMAGES_LOADED_STATE);
      }).catch(() => {
        this.getActiveStateExpression().setValue(OpenAICreatePicturesDialog.EMPTY_STATE);
      });
    }
  }

  getThumbnailTemplate(): XTemplate {
    return new XTemplate(
      "<div class=\"" + OpenAICreatePicturesDialog.THUMBNAILS_BLOCK + "\">",
      "<tpl for=\".\">",
      "<div class=\"" + OpenAICreatePicturesDialog.THUMBNAILS_ELEMENT_ITEM + "\" data-zoom=\"{zoom}\" style=\"width: {zoom}px; height: {zoom}px;\">",
      "<img src=\"{url}\" alt=\"thumbnail\"/>",
      "</div>",
      "</tpl>",
      "</div>");
  }

  handleCreate(): void {
    let selection = ArrayUtils.asArray(this.getSelectedImagesExpression().getValue());
    const imageUrls = selection.map((item: Bean) => {return item.get("url");});

    if (!imageUrls || imageUrls.length < 1) {
      return;
    }

    let creationFolderExpression = ValueExpressionFactory.createFromFunction(() => {
      const paths = ContentCreationUtil.getFolderDefaultsExpression("CMPicture", null).getValue();

      if (!paths) {
        return undefined;
      }

      if (paths && paths.length > 0) {
        const path = paths[0];
        if (!path) {
          return undefined;
        }

        // Get content for path
        let child = session._.getConnection().getContentRepository().getChild(path);
        if (!child) {
          return undefined;
        }

        return child;
      }

      return null;
    });

    creationFolderExpression.loadValue((folder) => {
      this.getActiveStateExpression().setValue(OpenAICreatePicturesDialog.CONTENT_CREATION_IN_PROGRESS_STATE);

      OpenAIService.createPicturesForUrls(imageUrls, folder).then((contentList) => {
        this.getActiveStateExpression().setValue(OpenAICreatePicturesDialog.CONTENT_CREATION_SUCCESS_STATE);
        const openInTab = this.getOpenInTabExpression().getValue();
        if (contentList && openInTab) {
          editorContext._.getContentTabManager().openDocuments(contentList, true);
        }
      });
    });
  }

  calculateCreateBtnDisabledState(activeState: String): Boolean {
    let disabled = true;
    let selectedImages = ArrayUtils.asArray(this.getSelectedImagesExpression().getValue());
    if (OpenAICreatePicturesDialog.IMAGES_LOADED_STATE === activeState && selectedImages.length > 0) {
      disabled = false;
    }
    return disabled;
  }

  thumbnailZoomChanged(ve: ValueExpression): void {
    let zoom = ve.getValue();
    let images = ArrayUtils.asArray(this.getGeneratedImagesExpression().getValue());
    images.forEach((image: Bean) => {
      image.set("zoom", zoom);
    });
  }

}

export default OpenAICreatePicturesDialog;
