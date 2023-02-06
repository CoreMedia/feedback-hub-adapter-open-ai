package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.coremedia.xml.Markup;
import com.google.gson.annotations.SerializedName;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplyTextToContentJob implements Job {
  private static final Logger LOG = LoggerFactory.getLogger(ApplyTextToContentJob.class);
  public static final String DETAIL_TEXT_PROPERTY = "detailText";

  private String text;
  private String contentId;

  private final ContentRepository contentRepository;


  public ApplyTextToContentJob(CapConnection capConnection) {
    this.contentRepository = capConnection.getContentRepository();
  }

  @SerializedName("text")
  public void setText(String text) {
    this.text = text;
  }

  @SerializedName("contentId")
  public void setContentId(String contentId) {
    this.contentId = contentId;
  }

  @Nullable
  @Override
  public Object call(@NonNull JobContext jobContext) throws JobExecutionException {
    try {

      Content content = contentRepository.getContent(contentId);
      Markup newMarkup = TextToMarkupUtil.plainTextToMarkup(text);

      if (content.isCheckedOut()) {
        content.checkIn();
      }
      content.checkOut();
      content.set(DETAIL_TEXT_PROPERTY, newMarkup);
      content.checkIn();

      return content.getMarkup(DETAIL_TEXT_PROPERTY);
    } catch (Exception e) {
      LOG.error("Failed to apply text to content {}: {}", contentId, e.getMessage());
      throw new JobExecutionException(GenericJobErrorCode.FAILED);
    }
  }

}
