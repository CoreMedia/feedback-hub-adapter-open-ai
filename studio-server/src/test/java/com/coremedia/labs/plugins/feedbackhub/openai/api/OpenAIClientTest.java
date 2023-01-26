package com.coremedia.labs.plugins.feedbackhub.openai.api;

import com.theokanning.openai.OpenAiService;
import com.theokanning.openai.completion.CompletionRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 *
 */
public class OpenAIClientTest {
  private static final Logger LOG = LoggerFactory.getLogger(OpenAIClientTest.class);

  private static OpenAiService service;

  @BeforeAll
  static void setUp() {
    String apiKey = System.getenv("OPENAI_API_KEY");
    if (apiKey == null) {
      LOG.warn("Test ignored, pass env properties.");
      return;
    }
    service = new OpenAiService(apiKey, Duration.ofSeconds(20));
  }

  @Test
  public void testOpenAI() {
    String apiKey = System.getenv("OPENAI_API_KEY");
    if (apiKey == null) {
      LOG.warn("Test ignored, pass env properties.");
      return;
    }

    OpenAiService service = OpenAIClientTest.service;
    CompletionRequest request = CompletionRequest.builder()
            .prompt("explain what is CoreMedia Content Cloud in 3 paragraphs\n")
            .model("text-davinci-003")
            .temperature(0.3)
            .stream(true)
            .maxTokens(1000)
            .echo(true)
            .build();
    String text = service.createCompletion(request).getChoices().stream().findFirst().orElseThrow().getText();


  }
}
