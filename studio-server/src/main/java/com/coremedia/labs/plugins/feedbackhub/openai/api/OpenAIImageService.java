package com.coremedia.labs.plugins.feedbackhub.openai.api;

import com.coremedia.labs.plugins.feedbackhub.openai.api.entities.ImageGenerationRequest;
import com.coremedia.labs.plugins.feedbackhub.openai.api.entities.ImageGenerationResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import edu.umd.cs.findbugs.annotations.NonNull;
import edu.umd.cs.findbugs.annotations.Nullable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.stream.Collectors;

public class OpenAIImageService {

  private static final String CREATE_IMAGES_RESOURCE_URL = "https://api.openai.com/v1/images/generations";

  private RestTemplate restTemplate;

  public OpenAIImageService() {
    this.restTemplate = new RestTemplate();
  }

  @Nullable
  public List<String> generateImages(@NonNull String prompt, int numberOfImages, String size, String apiKey) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(apiKey);

    ImageGenerationRequest requestBody = new ImageGenerationRequest(prompt, numberOfImages, size);
    ObjectMapper objectMapper = new ObjectMapper();

    try {
      String s = objectMapper.writeValueAsString(requestBody);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    HttpEntity<ImageGenerationRequest> request = new HttpEntity<>(requestBody, headers);
    ResponseEntity<ImageGenerationResponse> response = restTemplate.postForEntity(CREATE_IMAGES_RESOURCE_URL, request, ImageGenerationResponse.class);

    ImageGenerationResponse body = response.getBody();

    if (HttpStatus.OK.equals(response.getStatusCode())) {
      return body.getData().stream().map(d -> d.getUrl()).collect(Collectors.toList());
    } else {
      return null;
    }

  }

}
