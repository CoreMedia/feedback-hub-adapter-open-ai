package com.coremedia.labs.plugins.feedbackhub.openai.api;

import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static com.coremedia.labs.plugins.feedbackhub.openai.api.entities.ImageGenerationRequest.IMAGE_SIZE_DEFAULT;
import static org.junit.Assert.assertEquals;

public class OpenAIImageServiceIT {

  OpenAIImageService imageService;

  @Before
  public void setUp() {
    imageService = new OpenAIImageService();
  }

  @Test
  public void testGenerateImages() throws Exception {
    List<String> result = imageService.generateImages("A cute baby cat", 2, IMAGE_SIZE_DEFAULT, "<API KEY>");
    assertEquals(2, result.size());
  }

}
