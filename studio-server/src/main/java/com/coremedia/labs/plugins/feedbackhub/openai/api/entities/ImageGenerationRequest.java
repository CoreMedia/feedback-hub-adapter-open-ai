package com.coremedia.labs.plugins.feedbackhub.openai.api.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageGenerationRequest {

  public static final String IMAGE_SIZE_SMALL = "256x256";
  public static final String IMAGE_SIZE_MEDIUM = "512x512";
  public static final String IMAGE_SIZE_LARGE = "1024x1024";
  public static final String IMAGE_SIZE_DEFAULT = IMAGE_SIZE_LARGE;

  public static final String RESPONSE_FORMAT_URL = "url";
  public static final String RESPONSE_FORMAT_BASE64_DATA = "b64_json";

  public static final String RESPONSE_FORMAT_DEFAULT = RESPONSE_FORMAT_URL;

  @JsonProperty("prompt")
  private String prompt;
  @JsonProperty("n")
  private int numberOfImages;
  @JsonProperty("size")
  private String size;
  @JsonProperty("response_format")
  private String responseFormat;

  public ImageGenerationRequest(String prompt) {
    this(prompt, 1, IMAGE_SIZE_DEFAULT, RESPONSE_FORMAT_DEFAULT);
  }

  public ImageGenerationRequest(String prompt, int numberOfImages, String size) {
    this(prompt, numberOfImages, size, RESPONSE_FORMAT_DEFAULT);
  }

  public ImageGenerationRequest(String prompt, int numberOfImages, String size, String responseFormat) {
    this.prompt = prompt;
    this.numberOfImages = numberOfImages;
    this.size = size;
    this.responseFormat = responseFormat;
  }

  public String getPrompt() {
    return prompt;
  }

  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  public int getNumberOfImages() {
    return numberOfImages;
  }

  public void setNumberOfImages(int numberOfImages) {
    this.numberOfImages = numberOfImages;
  }

  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public String getResponseFormat() {
    return responseFormat;
  }

  public void setResponseFormat(String responseFormat) {
    this.responseFormat = responseFormat;
  }
}
