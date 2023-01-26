const { jangarooConfig } = require("@jangaroo/core");

module.exports = {
  type: "code",
  sencha: {
    name: "com.coremedia.labs.plugins__studio-client.feedback-hub-adapter-open-ai",
    namespace: "com.coremedia.labs.plugins.feedbackhub.openai",
    css: [
      {
        path: "resources/css/openai-ui.css",
        bundle: false,
        includeInBundle: false,
      },
    ],
    studioPlugins: [
      {
        mainClass: "com.coremedia.labs.plugins.feedbackhub.openai.FeedbackHubOpenAIStudioPlugin",
        name: "FeedbackHub OpenAI",
      },
    ],
  },
};
