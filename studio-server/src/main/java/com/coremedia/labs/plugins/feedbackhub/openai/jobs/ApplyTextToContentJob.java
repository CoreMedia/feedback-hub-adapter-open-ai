package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.rest.cap.jobs.GenericJobErrorCode;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.coremedia.xml.Markup;
import com.coremedia.xml.MarkupFactory;
import com.google.gson.annotations.SerializedName;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.stream.Collectors;

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
      Markup newMarkup = convertPlainTextToMarkup();

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

  @NotNull
  private Markup convertPlainTextToMarkup() {
    String xmlStart = "<div xmlns=\"http://www.coremedia.com/2003/richtext-1.0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
    String xmlEnd = "</div>";

    //split at blank lines
    String xmlParagraphs = Arrays.stream(text.split("\\n\\n"))
            .map(paragraph -> "<p>" + paragraph + "</p>")
            .collect(Collectors.joining());

    String newXml = xmlStart + xmlParagraphs + xmlEnd;
    return MarkupFactory.fromString(newXml);
  }

}
