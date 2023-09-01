package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.feedbackhub.settings.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.coremedia.xml.Markup;
import com.google.gson.annotations.SerializedName;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplyTextToContentJob implements Job {
  private static final Logger LOG = LoggerFactory.getLogger(ApplyTextToContentJob.class);

  public static final String DETAIL_TEXT_PROPERTY = "detailText";
  public static final String SUMMARY_TEXT_PROPERTY = "teaserText";
  public static final String TITLE_TEXT_PROPERTY = "htmlTitle";
  public static final String HEADLINE_TEXT_PROPERTY = "title";
  public static final String METADATA_TEXT_PROPERTY = "htmlDescription";
  public static final String KEYWORDS_TEXT_PROPERTY = "keywords";

  private String text;
  private String contentId;
  private String actionId;
  private String siteId;
  private String groupId;

  private final ContentRepository contentRepository;
  private final FeedbackSettingsProvider settingsProvider;

  public ApplyTextToContentJob(CapConnection capConnection, FeedbackSettingsProvider settingsProvider) {
    this.contentRepository = capConnection.getContentRepository();
    this.settingsProvider = settingsProvider;
  }

  @SerializedName("text")
  public void setText(String text) {
    this.text = text;
  }

  @SerializedName("contentId")
  public void setContentId(String contentId) {
    this.contentId = contentId;
  }

  @SerializedName("siteId")
  public void setSiteId(String siteId) {
    this.siteId = siteId;
  }

  @SerializedName("actionId")
  public void setActionId(String actionId) {
    this.actionId = actionId;
  }

  @SerializedName("groupId")
  public void setGroupId(String groupId) {
    this.groupId = groupId;
  }

  @Nullable
  @Override
  public Object call(@NonNull JobContext jobContext) throws JobExecutionException {
    try {
      String sanitized = sanitizeText(text);

      Content content = contentRepository.getContent(contentId);
      Markup newMarkup = TextToMarkupUtil.plainTextToMarkup(sanitized);

      if (content.isCheckedOut()) {
        content.checkIn();
      }
      content.checkOut();

      OpenAISettings settings = getSettings();

      //apply generated text
      if (StringUtils.isEmpty(actionId)) {
        String propertyName = !StringUtils.isEmpty(settings.getTextProperty()) ? settings.getTextProperty() : DETAIL_TEXT_PROPERTY;
        content.set(propertyName, newMarkup);
      } else {
        //apply prompt engineered text
        switch (actionId) {
          case GenerateTextJob.ACTION_SUMMARIZE: {
            String propertyName = !StringUtils.isEmpty(settings.getSummaryProperty()) ? settings.getSummaryProperty() : SUMMARY_TEXT_PROPERTY;
            content.set(propertyName, newMarkup);
            break;
          }
          case GenerateTextJob.ACTION_EXTRACT_KEYWORDS: {
            String propertyName = !StringUtils.isEmpty(settings.getKeywordsProperty()) ? settings.getKeywordsProperty() : KEYWORDS_TEXT_PROPERTY;
            String keywords = this.sanitizeKeywords(sanitized);
            content.set(propertyName, keywords);
            break;
          }
          case GenerateTextJob.ACTION_GENERATE_HEADLINE: {
            String propertyName = !StringUtils.isEmpty(settings.getHeadlineProperty()) ? settings.getHeadlineProperty() : HEADLINE_TEXT_PROPERTY;
            content.set(propertyName, sanitized);
            break;
          }
          case GenerateTextJob.ACTION_GENERATE_METADATA: {
            String propertyName = !StringUtils.isEmpty(settings.getMetadataProperty()) ? settings.getMetadataProperty() : METADATA_TEXT_PROPERTY;
            content.set(propertyName, sanitized);
            break;
          }
          case GenerateTextJob.ACTION_GENERATE_TITLE: {
            String propertyName = !StringUtils.isEmpty(settings.getTitleProperty()) ? settings.getTitleProperty() : TITLE_TEXT_PROPERTY;
            content.set(propertyName, sanitized);
            break;
          }
          default: {
            throw new UnsupportedOperationException("Invalid actionId '" + actionId + "'");
          }
        }
      }

      content.checkIn();

      return text;
    } catch (Exception e) {
      LOG.error("Failed to apply text to content {}: {}", contentId, e.getMessage(), e);
      throw new JobExecutionException(GenericJobErrorCode.FAILED, new Object[]{e.getMessage()}, e);
    }
  }

  private String sanitizeText(String text) {
    String sanitized = text.replaceAll("\"", "");
    return sanitized;
  }

  private String sanitizeKeywords(String text) {
    if (text.contains(":")) {
      text = text.substring(text.indexOf(":") + 1);
    }

    if (text.endsWith(".")) {
      text = text.substring(0, text.lastIndexOf("."));
    }
    return text;
  }

  private OpenAISettings getSettings() {
    return settingsProvider.getSettings(OpenAISettings.class, groupId, groupId, siteId);
  }
}
