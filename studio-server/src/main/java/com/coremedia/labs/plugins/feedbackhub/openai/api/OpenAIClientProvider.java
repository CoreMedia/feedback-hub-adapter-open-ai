package com.coremedia.labs.plugins.feedbackhub.openai.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.client.OpenAiApi;
import com.theokanning.openai.service.OpenAiService;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.time.Duration;
import java.util.concurrent.ExecutorService;

public final class OpenAIClientProvider {

  private static OpenAiService client = null;

  private OpenAIClientProvider() {}

  public static OpenAiService getClient(String apiKey, Duration timeout) {
    if (client != null) {
      return client;
    }
    client = new OpenAiService(apiKey, timeout);
    return client;
  }

  public static OpenAiService getClient(String baseUrl, String apiKey, Duration timeout) {
    if (client != null) {
      return client;
    }
    OkHttpClient httpClient = OpenAiService.defaultClient(apiKey, timeout);

    Retrofit retrofit = retrofit(
      baseUrl,
      httpClient,
      OpenAiService.defaultObjectMapper());

    client = new OpenAiService(
      retrofit.create(OpenAiApi.class),
      httpClient.dispatcher().executorService());

    return OpenAIClientProvider.client;
  }

  private static Retrofit retrofit(String baseUrl, OkHttpClient client, ObjectMapper mapper) {
    return new Retrofit.Builder()
      .baseUrl(baseUrl)
      .client(client)
      .addConverterFactory(JacksonConverterFactory.create(mapper))
      .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
      .build();
  }
}
