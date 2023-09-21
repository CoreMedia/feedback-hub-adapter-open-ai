import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import icon from "./icons/openai.svg";

/**
 * Interface values for ResourceBundle "FeedbackHubOpenAIStudioPlugin".
 */
interface FeedbackHubOpenAIStudioPlugin_properties {

/**
 * General
 *#######################################################################################################################
 */
  OpenAI_iconCls: string;
  OpenAI_title: string;
  OpenAI_tooltip: string;
  OpenAI_ariaLabel: string;
  OpenAI_general_tab_title: string;
  /**
   * Custom UI
   *#######################################################################################################################
   */

  OpenAI_instruction_emptyText: string;
  OpenAI_instruction_blank_validation_text: string;
  OpenAI_instruction_submit_button_label: string;
  OpenAI_redo_text_button_label: string;
  OpenAI_apply_confirmation_title: string;
  OpenAI_apply_text_button_label: string;
  OpenAI_apply_text_popup_message: string;
  OpenAI_apply_text_popup_submit_button_label: string;
  OpenAI_default_state_title: string;
  OpenAI_default_state_text: string;
  OpenAI_empty_state_title: string;
  OpenAI_empty_state_text: string;
  OpenAI_loading_state_title: string;
  OpenAI_loading_state_text: string;
  OpenAI_action_detail_text: string;
  OpenAI_action_summarize_text: string;
  OpenAI_action_headline_text: string;
  OpenAI_action_title_text: string;
  OpenAI_action_metadata_text: string;
  OpenAI_action_keywords_text: string;
  OpenAI_credit_link: string;
  OpenAI_generated_text: string;
}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "FeedbackHubOpenAIStudioPlugin".
 * @see FeedbackHubOpenAIStudioPlugin_properties
 */
const FeedbackHubOpenAIStudioPlugin_properties: FeedbackHubOpenAIStudioPlugin_properties = {
  OpenAI_iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(icon),
  OpenAI_title: "OpenAI",
  OpenAI_tooltip: "AI-driven text generation",
  OpenAI_ariaLabel: "ChatGPT",
  OpenAI_general_tab_title: "ChatGPT",
  OpenAI_apply_confirmation_title: "Apply Generated Text?",
  OpenAI_redo_text_button_label: "Redo",
  OpenAI_apply_text_button_label: "Apply",
  OpenAI_apply_text_popup_message: " Are you sure you want to overwrite the existing \"{0}\"?",
  OpenAI_apply_text_popup_submit_button_label: "Confirm",

  OpenAI_instruction_emptyText: "Enter a question or idea to generate text based on AI",
  OpenAI_instruction_blank_validation_text: "This field is required",
  OpenAI_instruction_submit_button_label: "Submit",

  OpenAI_default_state_title: "ChatGPT",
  OpenAI_default_state_text: "Create content quickly and easily with ChatGPT. Start with an idea or question and we do the rest.",
  OpenAI_empty_state_title: "No result",
  OpenAI_empty_state_text: "OpenAI was not able to generate a result. Please rephrase your question and try again.",
  OpenAI_loading_state_title: "Writing",
  OpenAI_loading_state_text: "Please have a little patience while ChatGPT generates the text.",
  OpenAI_action_detail_text: "Article Text",
  OpenAI_action_summarize_text: "Summary / Teaser Text",
  OpenAI_action_headline_text: "Article Title",
  OpenAI_action_title_text: "HTML Title",
  OpenAI_action_metadata_text: "HTML Metadata Description",
  OpenAI_action_keywords_text: "Free Keywords",
  OpenAI_credit_link: "Service provided by OpenAI",
  OpenAI_generated_text: "Generated Text"
};

export default FeedbackHubOpenAIStudioPlugin_properties;
