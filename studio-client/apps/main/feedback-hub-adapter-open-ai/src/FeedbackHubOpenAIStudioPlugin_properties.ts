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
  OpenAI_details_tab_title: string;

  /**
   * Custom UI
   *#######################################################################################################################
   */

  OpenAI_question_label: string;

  OpenAI_question_emptyText: string;

  OpenAI_question_blank_validation_text: string;

  OpenAI_question_submit_button_label: string;

  OpenAI_generated_text_header: string;

  OpenAI_apply_text_button_label: string;

  OpenAI_apply_text_popup_message: string;

  OpenAI_apply_text_popup_submit_button_label: string;

  OpenAI_confidence_bar_label: string;

  OpenAI_default_state_title: string;
  OpenAI_default_state_text: string;

  OpenAI_empty_state_title: string;
  OpenAI_empty_state_text: string;

  OpenAI_loading_state_title: string;
  OpenAI_loading_state_text: string;
  OpenAI_sources_title: string;

  OpenAI_credit_link: string;


}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "FeedbackHubOpenAIStudioPlugin".
 * @see FeedbackHubOpenAIStudioPlugin_properties
 */
const FeedbackHubOpenAIStudioPlugin_properties: FeedbackHubOpenAIStudioPlugin_properties = {
  OpenAI_iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(icon),
  OpenAI_title: "OpenAI",
  OpenAI_tooltip: "AI driven text generation",
  OpenAI_ariaLabel: "OpenAI",
  OpenAI_general_tab_title: "General",
  OpenAI_details_tab_title: "Details",
  OpenAI_question_label: "Question/Idea",
  OpenAI_question_emptyText: "Enter a question or idea to generate text based on AI",
  OpenAI_question_blank_validation_text: "This field is required",
  OpenAI_question_submit_button_label: "Generate Text",
  OpenAI_generated_text_header: "Generated Text",
  OpenAI_apply_text_button_label: "Apply Text to Content",
  OpenAI_apply_text_popup_message: "This will override the existing Article Text.",
  OpenAI_apply_text_popup_submit_button_label: "Confirm",
  OpenAI_confidence_bar_label: "Confidence",
  OpenAI_default_state_title: "OpenAI",
  OpenAI_default_state_text: "Create content quickly and easily with the OpenAI  assistant. Start with an idea or question and we do the rest.",
  OpenAI_empty_state_title: "No result",
  OpenAI_empty_state_text: "OpenAI was not able to generate a result. Please rephrase your question and try again.",
  OpenAI_loading_state_title: "Writing ...",
  OpenAI_loading_state_text: "Please have some patience while OpenAI generates the text.",
  OpenAI_sources_title: "Sources",
  OpenAI_credit_link: "service provided by <a href=\"https://openai.com/\" target=\"_blank\">OpenAI</a>.",
};

export default FeedbackHubOpenAIStudioPlugin_properties;
