package com.coremedia.labs.plugins.feedbackhub.openai.api.entities;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class ImageGenerationResponse {

  @SerializedName("created")
  private String created;

  @SerializedName("data")
  private List<ImageGenerationResult> data;

  public String getCreated() {
    return created;
  }

  public void setCreated(String created) {
    this.created = created;
  }

  public List<ImageGenerationResult> getData() {
    return data;
  }

  public void setData(List<ImageGenerationResult> data) {
    this.data = data;
  }

  public static class ImageGenerationResult {

    @SerializedName("url")
    private String url;

    @SerializedName("b64_json")
    private String base64Data;

    public ImageGenerationResult() {
    }

    public String getUrl() {
      return url;
    }

    public void setUrl(String url) {
      this.url = url;
    }

    public String getBase64Data() {
      return base64Data;
    }

    public void setBase64Data(String base64Data) {
      this.base64Data = base64Data;
    }
  }

}
