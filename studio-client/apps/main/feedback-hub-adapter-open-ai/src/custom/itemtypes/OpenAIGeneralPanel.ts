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
import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import FeedbackItemPanel
  from "@coremedia/studio-client.main.feedback-hub-editor-components/components/itempanels/FeedbackItemPanel";
import Component from "@jangaroo/ext-ts/Component";
import Button from "@jangaroo/ext-ts/button/Button";
import Container from "@jangaroo/ext-ts/container/Container";
import FormPanel from "@jangaroo/ext-ts/form/Panel";
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
import OpenAIService from "../utils/OpenAIService";
import HorizontalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/HorizontalSpacingPlugin";
import SpacingBEMEntities from "@coremedia/studio-client.ext.ui-components/bem/SpacingBEMEntities";
import StringUtil from "@coremedia/studio-client.client-core/util/StringUtil";

interface OpenAIGeneralPanelConfig extends Config<FeedbackItemPanel> {
}

class OpenAIGeneralPanel extends FeedbackItemPanel {
  declare Config: OpenAIGeneralPanelConfig;

  static readonly RESPONSE_CONTAINER_ITEM_ID: string = "responseContainer";

  #generatedTextExpression: ValueExpression = null;
  #generatedTextActionExpression: ValueExpression = null;
  #actionIdExpression: ValueExpression = null;
  #actionLabelExpression: ValueExpression = null;

  #questionInputExpression: ValueExpression = null;

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
          items: [
            Config(EmptyContainer, {
              height: 350,
              itemId: OpenAIGeneralPanel.DEFAULT_STATE,
              iconElementName: "default-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_default_state_text,
            }),
            Config(EmptyContainer, {
              height: 590,
              itemId: OpenAIGeneralPanel.EMPTY_STATE,
              iconElementName: "empty-state-icon",
              bemBlockName: OpenAIGeneralPanel.BLOCK_CLASS_NAME,
              ui: ContainerSkin.GRID_100.getSkin(),
              title: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_title,
              text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_empty_state_text,
            }),
            Config(EmptyContainer, {
              height: 590,
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
                  fieldLabel: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_generated_text,
                  labelSeparator: "",
                  minHeight: 230,
                  labelAlign: "top",
                  autoScroll: true,
                  readOnly: true,
                  flex: 1,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      bindTo: this$.getGeneratedTextExpression(),
                    }),
                  ],
                }),
                Config(Container, {
                  margin: "12 0 24 0",
                  height: 36,
                  items: [
                    Config(Button, {
                      formBind: true,
                      ui: ButtonSkin.SECONDARY_LIGHT.getSkin(),
                      handler: bind(this$, this$.applyTextToContent),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label
                    }),
                  ],
                  layout: Config(VBoxLayout, {align: "end"}),
                }),
                /** Actions Generated Text Area **/
                Config(Container, {
                  margin: "0 0 24 0",
                  height: 160,
                  items: [
                    Config(TextArea, {
                      labelSeparator: "",
                      labelAlign: "top",
                      autoScroll: true,
                      readOnly: true,
                      flex: 1,
                      plugins: [
                        Config(BindPropertyPlugin, {
                          bindTo: this$.getGeneratedActionTextExpression(),
                        }),
                        Config(BindPropertyPlugin, {
                          componentProperty: "fieldLabel",
                          bindTo: this$.getActionIdExpression(),
                          transformer: actionId => FeedbackHubOpenAIStudioPlugin_properties['OpenAI_action_' + actionId + "_text"],
                        }),
                      ],
                    }),
                    Config(Container, {
                      margin: "12 0 0 0",
                      height: 36,
                      items: [
                        Config(Button, {
                          ui: ButtonSkin.SECONDARY_LIGHT.getSkin(),
                          handler: bind(this$, this$.applyActionTextToContent),
                          text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label
                        }),
                      ],
                      layout: Config(VBoxLayout, {align: "end"}),
                    }),
                  ],
                  layout: Config(VBoxLayout, {align: "stretch"}),
                  plugins: [
                    Config(BindPropertyPlugin, {
                      componentProperty: "hidden",
                      bindTo: this$.getActionIdExpression(),
                      transformer: (action: string): boolean => !action,
                    }),
                  ],
                }),

                /** Actions Container **/
                Config(Container, {
                  margin: "0 0 24 0",
                  items: [
                    Config(Button, {
                      ui: ButtonSkin.LINK.getSkin(),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_summarize_text,
                      handler: bind(this$, this$.applySummary),
                    }),
                    Config(Button, {
                      ui: ButtonSkin.LINK.getSkin(),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_headline_text,
                      handler: bind(this$, this$.applyHeadline),
                    }),
                    Config(Button, {
                      ui: ButtonSkin.LINK.getSkin(),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_title_text,
                      handler: bind(this$, this$.applyTitle),
                    }),
                    Config(Button, {
                      ui: ButtonSkin.LINK.getSkin(),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_metadata_text,
                      handler: bind(this$, this$.applyMetadata),
                    }),
                    Config(Button, {
                      ui: ButtonSkin.LINK.getSkin(),
                      text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_keywords_text,
                      handler: bind(this$, this$.applyKeywords),
                    }),
                  ],
                  plugins: [
                    Config(HorizontalSpacingPlugin, {modifier: SpacingBEMEntities.HORIZONTAL_SPACING_MODIFIER_200}),
                  ],
                  layout: Config(HBoxLayout, {
                    align: "stretch",
                    pack: "center",
                  })
                })
              ],
              layout: Config(VBoxLayout, {align: "stretch"}),
            }),
          ]
        }),
        // Input fields
        Config(FormPanel, {
          padding: "6 0 0 0",
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
              ui: ButtonSkin.LINK.getSkin(),
              handler: bind(this$, this$.applyQuestion),
              iconCls: CoreIcons_properties.send,
              scale: "medium",
              tooltip: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_instruction_submit_button_label,
            }),
          ],
          layout: Config(HBoxLayout, {
            align: "stretch",
            pack: "start",
          }),
          plugins: [
            Config(BindPropertyPlugin, {
              componentProperty: "hidden",
              bindTo: this$.getActiveStateExpression(),
              transformer: activeItemId => activeItemId === OpenAIGeneralPanel.LOADING_STATE,
            }),
          ],
        }),

        Config(Button, {
          margin: "24 0 0 0",
          ui: ButtonSkin.LINK.getSkin(),
          text: FeedbackHubOpenAIStudioPlugin_properties.OpenAI_credit_link,
          handler: bind(this$, this$.openOpenAI),
        }),
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

  getActionIdExpression(): ValueExpression {
    if (!this.#actionIdExpression) {
      this.#actionIdExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#actionIdExpression;
  }

  getActionLabelExpression(): ValueExpression {
    if (!this.#actionLabelExpression) {
      this.#actionLabelExpression = ValueExpressionFactory.createFromValue();
    }
    return this.#actionLabelExpression;
  }

  getGeneratedTextExpression(): ValueExpression {
    if (!this.#generatedTextExpression) {
      this.#generatedTextExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#generatedTextExpression;
  }

  getGeneratedActionTextExpression(): ValueExpression {
    if (!this.#generatedTextActionExpression) {
      this.#generatedTextActionExpression = ValueExpressionFactory.createFromValue("");
    }
    return this.#generatedTextActionExpression;
  }

  getActiveStateExpression(): ValueExpression {
    if (!this.#activeStateExpression) {
      this.#activeStateExpression = ValueExpressionFactory.createFromValue(OpenAIGeneralPanel.DEFAULT_STATE);
    }
    return this.#activeStateExpression;
  }

  applyActionTextToContent(): void {
    let title = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label;
    let msg = StringUtil.format(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_message, this.getActionLabelExpression().getValue());
    let buttonLabel = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_submit_button_label;
    MessageBoxUtil.showConfirmation(title, msg, buttonLabel,
      (btn: any): void => {
        if (btn === "ok") {
          const content: Content = this.contentExpression.getValue();
          const text = this.getGeneratedActionTextExpression().getValue();
          const actionId = this.getActionIdExpression().getValue();
          let siteId = editorContext._.getSitesService().getSiteIdFor(content);
          if (!siteId) {
            siteId = "all";
          }

          const params: Record<string, any> = {
            text: text,
            contentId: content.getId(),
            siteId: siteId,
            actionId: actionId,
            groupId: this.feedbackGroup.name,
          };

          const JOB_TYPE = "OpenAIApplyTextToContent";
          jobService._.executeJob(
            new GenericRemoteJob(JOB_TYPE, params),
            //on success
            (details: any): void => {
              console.log("[INFO]", "Text to content: " + details);
            },
            //on error
            (error: JobExecutionError): void => {
              console.log("[ERROR]", "Error applying text to content: " + error);
              MessageBoxUtil.showError("Error", "Error applying content: " + error.message);
            },
          );
        }
      });
  }

  applyTextToContent(): void {
    let title = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_button_label;
    let msg = StringUtil.format(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_message, FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_detail_text);
    let buttonLabel = FeedbackHubOpenAIStudioPlugin_properties.OpenAI_apply_text_popup_submit_button_label;
    MessageBoxUtil.showConfirmation(title, msg, buttonLabel,
      (btn: any): void => {
        if (btn === "ok") {
          const content: Content = this.contentExpression.getValue();
          const text = this.getGeneratedTextExpression().getValue();
          let siteId = editorContext._.getSitesService().getSiteIdFor(content);
          if (!siteId) {
            siteId = "all";
          }

          const params: Record<string, any> = {
            text: text,
            contentId: content.getId(),
            siteId: siteId,
            actionId: null,
            groupId: this.feedbackGroup.name,
          };

          const JOB_TYPE = "OpenAIApplyTextToContent";
          jobService._.executeJob(
            new GenericRemoteJob(JOB_TYPE, params),
            //on success
            (details: any): void => {
              console.log("[INFO]", "Text to content: " + details);
            },
            //on error
            (error: JobExecutionError): void => {
              console.log("[ERROR]", "Error applying text to content: " + error);
            },
          );
        }
      });
  }

  openOpenAI(): void {
    window.open("https://openai.com/", "_blank");
  }

  applyKeywords() {
    this.getActionLabelExpression().setValue(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_keywords_text);
    this.applyAction(OpenAIService.ACTION_EXTRACT_KEYWORDS);
  }

  applySummary() {
    this.getActionLabelExpression().setValue(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_summarize_text);
    this.applyAction(OpenAIService.ACTION_SUMMARIZE);
  }

  applyHeadline() {
    this.getActionLabelExpression().setValue(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_headline_text);
    this.applyAction(OpenAIService.ACTION_GENERATE_HEADLINE);
  }

  applyMetadata() {
    this.getActionLabelExpression().setValue(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_metadata_text);
    this.applyAction(OpenAIService.ACTION_GENERATE_METADATA);
  }

  applyTitle() {
    this.getActionLabelExpression().setValue(FeedbackHubOpenAIStudioPlugin_properties.OpenAI_action_title_text);
    this.applyAction(OpenAIService.ACTION_GENERATE_TITLE);
  }

  applyAction(actionId: string): void {
    this.getActionIdExpression().setValue(actionId);
    this.updateConversation();
  }

  applyQuestion(): void {
    this.getActionIdExpression().setValue(null);
    this.updateConversation();
  }

  updateConversation(): void {
    let input = this.getQuestionInputExpression().getValue();
    if (!input || input.trim().length === 0) {
      this.getActiveStateExpression().setValue(OpenAIGeneralPanel.DEFAULT_STATE);
      return;
    }

    const content: Content = this.contentExpression.getValue();
    let siteId = editorContext._.getSitesService().getSiteIdFor(content);
    if (!siteId) {
      siteId = "all";
    }

    //if an action is set, the text was already generated, and we re-use it for other actions
    const actionId = this.getActionIdExpression().getValue();
    if (actionId) {
      input = this.#generatedTextExpression.getValue();
    }

    const params: Record<string, any> = {
      prompt: input,
      contentId: content.getId(),
      siteId: siteId,
      actionId: actionId,
      groupId: this.feedbackGroup.name,
    };

    const JOB_TYPE = "OpenAIGenerateText";

    jobService._.executeJob(
      new GenericRemoteJob(JOB_TYPE, params),
      //on success
      (details: any): void => {
        this.getActiveStateExpression().setValue(OpenAIGeneralPanel.SUCCESS_STATE);
        if (actionId) {
          this.getGeneratedActionTextExpression().setValue(details);
        } else {
          this.getGeneratedTextExpression().setValue(details);
        }
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
