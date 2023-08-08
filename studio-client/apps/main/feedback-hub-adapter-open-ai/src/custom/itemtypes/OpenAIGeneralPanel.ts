import GenericRemoteJob from "@coremedia/studio-client.cap-rest-client-impl/common/impl/GenericRemoteJob";
import JobExecutionError from "@coremedia/studio-client.cap-rest-client/common/JobExecutionError";
import jobService from "@coremedia/studio-client.cap-rest-client/common/jobService";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import VerticalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/VerticalSpacingPlugin";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import FeedbackItemPanel
  from "@coremedia/studio-client.main.feedback-hub-editor-components/components/itempanels/FeedbackItemPanel";
import Component from "@jangaroo/ext-ts/Component";
import Button from "@jangaroo/ext-ts/button/Button";
import Container from "@jangaroo/ext-ts/container/Container";
import FormPanel from "@jangaroo/ext-ts/form/Panel";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import AnchorLayout from "@jangaroo/ext-ts/layout/container/Anchor";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import {bind} from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import FeedbackHubOpenAIStudioPlugin_properties from "../../FeedbackHubOpenAIStudioPlugin_properties";
import MessageBoxUtil from "@coremedia/studio-client.ext.ui-components/messagebox/MessageBoxUtil";
import BaseField from "@jangaroo/ext-ts/form/field/Base";
import ExtEvent from "@jangaroo/ext-ts/event/Event";
import EmptyContainer from "@coremedia/studio-client.ext.ui-components/components/EmptyContainer";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import SwitchingContainer from "@coremedia/studio-client.ext.ui-components/components/SwitchingContainer";
import TextArea from "@jangaroo/ext-ts/form/field/TextArea";
import SliderField from "@jangaroo/ext-ts/slider/Single";
import SliderSkin from "@coremedia/studio-client.ext.ui-components/skins/SliderSkin";
import NumberField from "@jangaroo/ext-ts/form/field/Number";
import CollapsiblePanel from "@coremedia/studio-client.ext.ui-components/components/panel/CollapsiblePanel";
import Spacer from "@jangaroo/ext-ts/toolbar/Spacer";
import AddQuickTipPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddQuickTipPlugin";

interface OpenAIGeneralPanelConfig extends Config<FeedbackItemPanel> {
}

class OpenAIGeneralPanel extends FeedbackItemPanel {
  declare Config: OpenAIGeneralPanelConfig;

  static readonly CONFIDENCE_BAR_ITEM_ID: string = "confidenceBar";
  static readonly RESPONSE_CONTAINER_ITEM_ID: string = "responseContainer";

  #generatedTextExpression: ValueExpression = null;

  #questionInputExpression: ValueExpression = null;

  #temperatureExpression: ValueExpression = null;

  #maximumLengthExpression: ValueExpression = null;

  #activeStateExpression: ValueExpression = null;

  static readonly DEFAULT_STATE: string = "default";
  static readonly EMPTY_STATE: string = "empty";
  static readonly LOADING_STATE: string = "loading";
  static readonly SUCCESS_STATE: string = "success";

  static readonly BLOCK_CLASS_NAME: string = "openai-general-panel";

  //dirty
  static override readonly xtype: string = "com.coremedia.labs.plugins.feedbackhub.openai.config.OpenAIGeneralPanel";

  constructor(config: Config<OpenAIGeneralPanel> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenAIGeneralPanel, {
      cls: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
      items: [
        // Results
        Config(SwitchingContainer, {
          itemId: OpenAIGeneralPanel.RESPONSE_CONTAINER_ITEM_ID,
          activeItemValueExpression: this$.getActiveStateExpression(),
          minHeight: 300,
          items: [
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.DEFAULT_STATE,
              iconElementName: "default-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_text,
            }),
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.EMPTY_STATE,
              iconElementName: "empty-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_text,
            }),
            Config(EmptyContainer, {
              itemId: OpenAIGeneralPanel.LOADING_STATE,
              iconElementName: "loading-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_loading_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_loading_state_text,
            }),
            Config(Container, {
              itemId: OpenAIGeneralPanel.SUCCESS_STATE,
              items: [
                Config(TextArea, {
                  autoScroll: true,
                  readOnly: true,
                  flex: 1,
                  minHeight: 300,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      bindTo: this$.getGeneratedTextExpression(),
                    }),
                  ],
                }),
                Config(Container, {height: 6}),
                Config(Container, {
                  items: [
                    Config(Button, {
                      formBind: true,
                      ui: ButtonSkin.VIVID.getSkin(),
                      handler: bind(this$, this$.applyTextToContent),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label
                    }),
                  ],
                  layout: Config(VBoxLayout, {align: "end"}),
                })
              ],
              layout: Config(VBoxLayout, {align: "stretch"}),
            }),
          ]
        }),
        // Input fields
        Config(FormPanel, {
          items: [
            Config(TextField, {
              flex: 1,
              cls: "openai-input-text-field",
              itemId: "questionField",
              blankText: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_instruction_blank_validation_text,
              emptyText: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_instruction_emptyText,
              plugins: [
                Config(BindPropertyPlugin, {
                  bindTo: this$.getQuestionInputExpression(),
                  bidirectional: true,
                }),
              ],
              listeners: {
                "specialkey": (field: BaseField, e: ExtEvent) => {
                  if (e.getKey() === ExtEvent.ENTER) {
                    this.applyQuestion();
                  }
                }
              },
            }),
            Config(Container, {width: 6}),
            Config(Button, {
              formBind: true,
              ui: ButtonSkin.MATERIAL_PRIMARY.getSkin(),
              handler: bind(this$, this$.applyQuestion),
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_instruction_submit_button_label,
            }),
          ],
          layout: Config(HBoxLayout, {
            align: "stretch",
            pack: "start",
          }),
        }),

        Config(Spacer, {height: 10}),

        Config(CollapsiblePanel, {
          title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_title,
          cls: "openai-chatgpt-settings",
          collapsible: true,
          collapsed: true,
          items: [
            Config(Container, {
              items: [
                // Temperature
                Config(SliderField, {
                  fieldLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_temperature_fieldLabel,
                  ui: SliderSkin.DEFAULT.getSkin(),
                  flex: 1,
                  minValue: 0.0,
                  maxValue: 1.0,
                  increment: 0.01,
                  decimalPrecision: 2,
                  labelSeparator: "",
                  plugins: [
                    Config(BindPropertyPlugin, {
                      componentProperty: "value",
                      bindTo: this$.getTemperatureExpression(),
                      bidirectional: true,
                    }),
                    Config(AddQuickTipPlugin, {
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_temperature_tooltip
                    })
                  ],
                }),
                Config(NumberField, {
                  width: 40,
                  allowDecimals: true,
                  minValue: 0,
                  maxValue: 1,
                  allowBlank: false,
                  hideTrigger: true,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      componentProperty: "value",
                      bindTo: this$.getTemperatureExpression(),
                      bidirectional: true,
                    }),
                    Config(AddQuickTipPlugin, {
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_temperature_tooltip
                    })
                  ],
                }),
              ],
                layout: Config(HBoxLayout, {
                  align: "stretch",
                  pack: "start",
                }),
            }),

            Config(Spacer, {height: 24}),

            Config(Container, {
              items: [
                // Maximum length
                Config(SliderField, {
                  fieldLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_maxLength_fieldLabel,
                  ui: SliderSkin.DEFAULT.getSkin(),
                  flex: 1,
                  minValue: 1,
                  maxValue: 4000,
                  increment: 1,
                  labelSeparator: "",
                  plugins: [
                    Config(BindPropertyPlugin, {
                      componentProperty: "value",
                      bindTo: this$.getMaximumLengthExpression(),
                      bidirectional: true,
                    }),
                    Config(AddQuickTipPlugin, {
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_maxLength_tooltip
                    })
                  ],
                }),
                Config(NumberField, {
                  width: 40,
                  allowDecimals: false,
                  minValue: 1,
                  maxValue: 4000,
                  allowBlank: false,
                  hideTrigger: true,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      componentProperty: "value",
                      bindTo: this$.getMaximumLengthExpression(),
                      bidirectional: true,
                    }),
                    Config(AddQuickTipPlugin, {
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_settings_maxLength_tooltip
                    })
                  ],
                }),
              ],
              layout: Config(HBoxLayout, {
                align: "stretch",
                pack: "start",
              }),
            }),
          ],
          layout: Config(VBoxLayout, {
            align: "stretch",
            pack: "start",
          }),
        }),
        Config(DisplayField, {
          cls: `${OpenAIGeneralPanel.BLOCK_CLASS_NAME}__credit_link`,
          value: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_credit_link,
          htmlEncode: false
        })
      ],
      defaultType: Component.xtype,
      defaults: Config<Component>({anchor: "100%"}),
      layout: Config(AnchorLayout),
      plugins: [
        Config(VerticalSpacingPlugin),
      ],
    }), config));
  }

  getQuestionInputExpression(): ValueExpression {
    if (!this.#questionInputExpression) {
      this.#questionInputExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#questionInputExpression;
  }

  getTemperatureExpression(): ValueExpression {
    if (!this.#temperatureExpression) {
      this.#temperatureExpression = ValueExpressionFactory.createFromValue(0.3);
    }
    return this.#temperatureExpression;
  }

  getMaximumLengthExpression(): ValueExpression {
    if (!this.#maximumLengthExpression) {
      this.#maximumLengthExpression = ValueExpressionFactory.createFromValue(1000);
    }
    return this.#maximumLengthExpression;
  }

  getGeneratedTextExpression(): ValueExpression {
    if (!this.#generatedTextExpression) {
      this.#generatedTextExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#generatedTextExpression;
  }

  getActiveStateExpression(): ValueExpression {
    if (!this.#activeStateExpression) {
      this.#activeStateExpression = ValueExpressionFactory.createFromValue(OpenAIGeneralPanel.DEFAULT_STATE);
    }
    return this.#activeStateExpression;
  }

  applyTextToContent(b: Button): void {
    let title = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label;
    let msg = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_message;
    let buttonLabel = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_submit_button_label;
    MessageBoxUtil.showConfirmation(title, msg, buttonLabel,
      (btn: any): void => {
        if (btn === "ok") {
          const content: Content = this.contentExpression.getValue();
          const text = this.getGeneratedTextExpression().getValue();
          const params: Record<string, any> = {
            text: text,
            contentId: content.getId(),
          };

          const JOB_TYPE = "OpenAIApplyTextToContent";
          jobService._.executeJob(
            new GenericRemoteJob(JOB_TYPE, params),
            //on success
            (details: any): void => {
            },
            //on error
            (error: JobExecutionError): void => {
              console.log("[ERROR]", "Error applying text to content: " + error);
            },
          );
        }
      });
  }

  applyQuestion(): void {
    const input = this.getQuestionInputExpression().getValue();
    if (!input || input.trim().length === 0) {
      this.getActiveStateExpression().setValue(OpenAIGeneralPanel.DEFAULT_STATE);
      return;
    }

    const content: Content = this.contentExpression.getValue();
    let siteId = editorContext._.getSitesService().getSiteIdFor(content);
    if (!siteId) {
      siteId = "all";
    }

    const params: Record<string, any> = {
      prompt: input,
      temperature: this.getTemperatureExpression().getValue(),
      maxLength: this.getMaximumLengthExpression().getValue(),
      contentId: content.getId(),
      siteId: siteId,
      groupId: this.feedbackGroup.name,
    };

    const JOB_TYPE = "OpenAIGenerateText";

    jobService._.executeJob(
      new GenericRemoteJob(JOB_TYPE, params),
      //on success
      (details: any): void => {

        this.getActiveStateExpression().setValue(OpenAIGeneralPanel.SUCCESS_STATE);
        this.getGeneratedTextExpression().setValue(details);

      },
      //on error
      (error: JobExecutionError): void => {
        this.getActiveStateExpression().setValue(OpenAIGeneralPanel.EMPTY_STATE);
        console.log("[ERROR]", "Error applying question: " + error);
      },
    );

    this.getActiveStateExpression().setValue(OpenAIGeneralPanel.LOADING_STATE);
  }

}

export default OpenAIGeneralPanel;
