package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.xml.Markup;
import com.coremedia.xml.MarkupFactory;
import com.google.common.annotations.VisibleForTesting;
import org.jetbrains.annotations.NotNull;

import static java.util.Arrays.stream;
import static java.util.stream.Collectors.joining;

public class TextToMarkupUtil {

  public static final String LIST_ELEMENT_OPENING_TAG = "<li>";
  public static final String LIST_ELEMENT_CLOSING_TAG = "</li>";
  public static final String ORDERED_LIST_OPENING_TAG = "<ol>";
  public static final String ORDERED_LIST_CLOSING_TAG = "</ol>";
  public static final String NEW_LINE_DELIMITER = "\n";
  public static final String ORDERED_LIST_PATTERN = "^[0-9]+[.]+.*";
  public static final String BREAK = "<br/>";
  public static final String PARAGRAPH_OPENING_TAG = "<p>";
  public static final String PARAGRAPH_CLOSING_TAG = "</p>";
  public static final String BLANK_LINE_DELIMITER = "\n\n";

  private TextToMarkupUtil() {
  }

  @NotNull
  public static Markup plainTextToMarkup(String text) {
    String newXml = plaintTextToXml(text);
    return MarkupFactory.fromString(newXml);
  }

  @NotNull
  @VisibleForTesting
  static String plaintTextToXml(String text) {
    String xmlStart = "<div xmlns=\"http://www.coremedia.com/2003/richtext-1.0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
    String xmlEnd = "</div>";

    String withDFormattedLists = formatOrderedLists(text);
    String withTransformedNewLines = formatNewLines(withDFormattedLists);
    String transformedText = formatParagraphs(withTransformedNewLines);

    return xmlStart + transformedText + xmlEnd;
  }

  @NotNull
  private static String formatParagraphs(String result) {
    return stream(result.split("<br/><br/>"))
      .map(paragraph -> {
        String trimmedLine = paragraph.replaceFirst("<br/>", "");
        if (trimmedLine.startsWith(ORDERED_LIST_OPENING_TAG)) {
          return trimmedLine;
        }
        return PARAGRAPH_OPENING_TAG + trimmedLine + PARAGRAPH_CLOSING_TAG;
      })
      .collect(joining());
  }

  @NotNull
  private static String formatNewLines(String text) {
    String result = text.replace(NEW_LINE_DELIMITER + ORDERED_LIST_OPENING_TAG, "\n\n" + ORDERED_LIST_OPENING_TAG);
    return result.replace(NEW_LINE_DELIMITER, BREAK);
  }

  /**
   * formats ordered lists in the given text in the following format:
   * <ol>
   *   <li></li>
   * </ol>
   */
  @NotNull
  private static String formatOrderedLists(String text) {
    String[] lines = text.trim().split(NEW_LINE_DELIMITER);
    boolean textIncludesOrderedList = stream(lines).anyMatch(line -> line.matches(ORDERED_LIST_PATTERN));
    if (!textIncludesOrderedList) {
      return text;
    }
    String textWithProcessedLists = addHtmlTagsToLists(text);
    return removeLinebreaksInsideLists(textWithProcessedLists);
  }

  @NotNull
  private static String addHtmlTagsToLists(String text) {
    String[] lines = text.trim().split(NEW_LINE_DELIMITER);
    String textWithProcessedListItems = stream(lines).map(line -> {
      //numeric + "." + anything
      if (line.matches(ORDERED_LIST_PATTERN)) {
        String lineWithoutLeadingNumber = line.replaceFirst("^[0-9]+[.]+", "");
        return LIST_ELEMENT_OPENING_TAG + lineWithoutLeadingNumber.trim() + LIST_ELEMENT_CLOSING_TAG;
      }
      return line;
    }).collect(joining(NEW_LINE_DELIMITER));

    String toReplace = LIST_ELEMENT_CLOSING_TAG;
    int start = textWithProcessedListItems.lastIndexOf(toReplace);
    String replacement = LIST_ELEMENT_CLOSING_TAG + ORDERED_LIST_CLOSING_TAG;
    String formatted = textWithProcessedListItems.replaceFirst(LIST_ELEMENT_OPENING_TAG, ORDERED_LIST_OPENING_TAG + LIST_ELEMENT_OPENING_TAG);
    formatted = formatted.substring(0, formatted.lastIndexOf(LIST_ELEMENT_CLOSING_TAG));
    textWithProcessedListItems = formatted + replacement + textWithProcessedListItems.substring(start + toReplace.length());
    return textWithProcessedListItems;
  }

  /**
   * Removes blank lines and new lines inside all list in the given text
   */
  @NotNull
  private static String removeLinebreaksInsideLists(String textWithProcessedLists) {
    return textWithProcessedLists
      .replaceAll(LIST_ELEMENT_CLOSING_TAG + BLANK_LINE_DELIMITER, LIST_ELEMENT_CLOSING_TAG)
      .replaceAll(LIST_ELEMENT_CLOSING_TAG + NEW_LINE_DELIMITER, LIST_ELEMENT_CLOSING_TAG);
  }

}
