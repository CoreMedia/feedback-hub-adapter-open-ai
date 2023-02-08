package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.cap.common.Blob;
import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.cap.content.ContentType;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.google.gson.annotations.SerializedName;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import javax.activation.MimeTypeParseException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class CreatePicturesFromUrlsJob implements Job {

  protected static final String HEADER_CONTENT_TYPE = "Content-Type";
  protected static final String HEADER_CONTENT_LENGTH = "Content-Length";

  private ContentRepository contentRepository;

  public CreatePicturesFromUrlsJob(ContentRepository contentRepository) {
    this.contentRepository = contentRepository;
  }

  @SerializedName("imageUrls")
  private List<String> imageUrls;

  @SerializedName("parentFolder")
  private Content parentFolder;

  @Nullable
  @Override
  public Object call(@NotNull JobContext jobContext) throws JobExecutionException {
    List<Content> createdContentList = new ArrayList<>();

    if (getImageUrls() != null) {
      for (String url : getImageUrls()) {
        createdContentList.add(createPicture(url, getParentFolder()));
      }
    }

    return createdContentList;
  }

  private Content createPicture(String url, Content parentFolder) {
    ContentType contentType = contentRepository.getContentType("CMPicture");
    Content content = contentRepository.createContentBuilder()
      .parent(parentFolder)
      .type(contentType)
      .name("Generated Picture")
      .nameTemplate()
      .create();

    Blob pictureDataBlob = createBlobFromUrl(url);
    content.set("data", pictureDataBlob);
    content.set("copyright", "DALL·E, OpenAI");

    return content;
  }

  private Blob createBlobFromUrl(String url) {
    try {

      HttpClient httpClient = HttpClient.newBuilder().build();
      HttpRequest request = HttpRequest.newBuilder()
        .GET()
        .uri(URI.create(url))
        .build();

      HttpResponse<InputStream> response = null;
      response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());

      String contentType = response.headers().firstValue(HEADER_CONTENT_TYPE)
        .orElseThrow(() -> new RuntimeException("Missing or invalid Content-Type"));

      int contentLength = response.headers().firstValue(HEADER_CONTENT_LENGTH)
        .map(Integer::parseInt)
        .orElseThrow(() -> new IllegalArgumentException("Missing or invalid Content-Length"));

      Blob blob = contentRepository.getConnection().getBlobService().fromInputStream(response.body(), contentType, contentLength);
      return blob;

    } catch (IOException | InterruptedException | MimeTypeParseException e) {
      throw new RuntimeException(e);
    }
  }

  public List<String> getImageUrls() {
    return imageUrls;
  }

  public void setImageUrls(List<String> imageUrls) {
    this.imageUrls = imageUrls;
  }

  public Content getParentFolder() {
    return parentFolder;
  }

  public void setParentFolder(Content parentFolder) {
    this.parentFolder = parentFolder;
  }
}
