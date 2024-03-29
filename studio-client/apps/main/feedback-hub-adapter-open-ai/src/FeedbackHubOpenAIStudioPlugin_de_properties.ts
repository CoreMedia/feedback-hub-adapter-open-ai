import ResourceBundleUtil from "@jangaroo/runtime/l10n/ResourceBundleUtil";
import FeedbackHubOpenAIStudioPlugin_properties from "./FeedbackHubOpenAIStudioPlugin_properties";

/**
 * Overrides of ResourceBundle "FeedbackHubOpenAIStudioPlugin" for Locale "de".
 */
ResourceBundleUtil.override(FeedbackHubOpenAIStudioPlugin_properties, {
  OpenAI_title: "OpenAI",
  OpenAI_tooltip: "AI-basierte Text-Generierung",
  OpenAI_ariaLabel: "ChatGPT",
  OpenAI_general_tab_title: "ChatGPT",
  OpenAI_apply_confirmation_title: "Generierten Text Anwenden?",
  OpenAI_redo_text_button_label: "Erneut Generieren",
  OpenAI_apply_text_button_label: "Anwenden",
  OpenAI_apply_text_popup_message: "Sind Sie sicher, dass Sie den Text im Feld \"{0}\" überschreiben wollen?",
  OpenAI_apply_text_popup_submit_button_label: "Bestätigen",

  OpenAI_instruction_emptyText: "Geben Sie eine Frage oder Idee ein, um Text generieren zu lassen.",
  OpenAI_instruction_blank_validation_text: "Notwendiges Feld",
  OpenAI_instruction_submit_button_label: "Senden",

  OpenAI_default_state_title: "ChatGPT",
  OpenAI_default_state_text: "Erzeugen Sie neue Inhalte schnell und einfach mit ChatGPT. Starten Sie mit einer Idee oder Frage, wir erledigen den Rest.",
  OpenAI_empty_state_title: "Kein Ergebnis",
  OpenAI_empty_state_text: "OpenAI war nicht in der Lage, ein Ergebnis zu generieren. Bitte formulieren Sie ihre Frage um und versuchen Sie es erneut.",
  OpenAI_loading_state_title: "Schreibe",
  OpenAI_loading_state_text: "Bitte haben Sie etwas Geduld während ChatGPT den Text generiert.",
  OpenAI_action_detail_text: "Artikel-Text",
  OpenAI_action_summarize_text: "Zusammenfassung / Teaser-Text",
  OpenAI_action_headline_text: "Artikel-Titel",
  OpenAI_action_title_text: "HTML Titel",
  OpenAI_action_metadata_text: "HTML Meta-Beschreibung",
  OpenAI_action_keywords_text: "Freie Schlagworte",
  OpenAI_credit_link: "Bereitgestellt durch OpenAI",
  OpenAI_generated_text: "Generierter Text",
});
