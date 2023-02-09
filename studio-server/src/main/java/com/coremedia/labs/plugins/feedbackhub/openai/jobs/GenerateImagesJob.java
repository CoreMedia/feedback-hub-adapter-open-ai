package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.labs.plugins.feedbackhub.openai.FeedbackSettingsProvider;
import com.coremedia.labs.plugins.feedbackhub.openai.OpenAISettings;
import com.coremedia.labs.plugins.feedbackhub.openai.api.OpenAIImageService;
import com.coremedia.rest.cap.jobs.Job;
import com.coremedia.rest.cap.jobs.JobContext;
import com.coremedia.rest.cap.jobs.JobExecutionException;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;
import java.util.Map;

import static com.coremedia.labs.plugins.feedbackhub.openai.api.entities.ImageGenerationRequest.IMAGE_SIZE_DEFAULT;

public class GenerateImagesJob implements Job {

  private static final int DEFAULT_NUMBER_OF_IMAGES = 3;

  @SerializedName("prompt")
  private String prompt;
  @SerializedName("numberOfImages")
  private int numberOfImages;
  @SerializedName("size")
  private String size;
  @SerializedName("siteId")
  private String siteId;
  @SerializedName("groupId")
  private String groupId;


  private final FeedbackSettingsProvider settingsProvider;

  private final OpenAIImageService imageService;

  public GenerateImagesJob(FeedbackSettingsProvider settingsProvider, OpenAIImageService openAIImageService) {
    this.settingsProvider = settingsProvider;
    this.imageService = openAIImageService;
  }

  @Nullable
  @Override
  public Object call(@NotNull JobContext jobContext) throws JobExecutionException {
    OpenAISettings settings = getSettings();
    List<String> imageUrls = imageService.generateImages(
      getPrompt(),
      getNumberOfImages(),
      getSize(),
      settings.getApiKey());
    Map<String, Object> response = Map.of("urls", imageUrls);
    return response;
  }

  private OpenAISettings getSettings() {
    return settingsProvider.getSettings(groupId, siteId);
  }

  public String getPrompt() {
    return prompt;
  }

  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  public int getNumberOfImages() {
    if (numberOfImages < 1 || numberOfImages > 10) {
      try {
        int n = getSettings().getNumberOfImagesToGenerate();
        if (n < 1 || n > 10) {
          n = DEFAULT_NUMBER_OF_IMAGES;
        }
        return n;
      } catch (Exception e) {
        return DEFAULT_NUMBER_OF_IMAGES;
      }
    }
    return numberOfImages;
  }

  public void setNumberOfImages(int numberOfImages) {
    this.numberOfImages = numberOfImages;
  }

  public String getSize() {
    if (size == null) {
      return IMAGE_SIZE_DEFAULT;
    }
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public String getSiteId() {
    if (StringUtils.isBlank(siteId)) {
      return "all";
    }
    return siteId;
  }

  public void setSiteId(String siteId) {
    this.siteId = siteId;
  }

  public String getGroupId() {
    if (StringUtils.isBlank(groupId)) {
      return "OpenAI";
    }
    return groupId;
  }

  public void setGroupId(String groupId) {
    this.groupId = groupId;
  }

  public FeedbackSettingsProvider getSettingsProvider() {
    return settingsProvider;
  }
}
