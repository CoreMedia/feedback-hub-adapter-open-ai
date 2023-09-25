# Editorial Quick Start

--------------------------------------------------------------------------------

\[[Up](README.md)\] \[[Top](#top)\]

--------------------------------------------------------------------------------

## Table of contents

* [Introducing](#introducing)
* [Basic adapter configuration](#basic-adapter-configuration)
  * [Global adapter configuration](#global-adapter-configuration)
  * [Site specific adapter configuration](#site-specific-adapter-configuration)
  * [Basic structure](#basic-structure)
  * [Required configuration](#required-configuration)
  * [Example](#example)     
* [Usage](#usage)    

## Introducing

## Basic adapter configuration
This section covers the two possibilities to enable the feedback-hub-adapter-open-ai integration. Please note that those
options are valid for all feedback-hub-adapters. Before configuring the adapter, please refer to the documentation [Content hub configuration](https://documentation.coremedia.com/cmcc-10/artifacts/2004/webhelp/deployment-en/content/Studio-Contenthub-Configuration.html)
for preliminary steps.

### Global adapter configuration
To enable the feedback-hub-adapter-open-ai for all sites, it is necessary to create a CMSettings document located at:
* /Settings/Options/Settings/Feedback Hub/
For convenience reasons, naming proposal of this document is "OpenAI"

### Site specific adapter configuration
To enable the feedback-hub-adapter-open-ai for a single site, it is necessary to create a CMSettings document located at:
* Options/Settings/Feedback Hub/ (relative to the site's root folder)
For convenience reasons, naming proposal of this document is "OpenAI" (name of the third party system)

#### Basic structure

The given list shows the values that are required for the feedback-hub-adapter-open-ai adapter configuration. The values are:

| Key             | Type    | Value             | Required   |
|-----------------|---------|-------------------|------------|
| connectionId    | String  | <SOME_UNIQUE_ID>  | Yes        |
| factoryId       | String  | OpenAI            | Yes        |
| enabled         | Boolean | true or false     | Yes        |
| contentType     | String  | CoreMedia DocType | Yes        |
| settings        | Struct  |                   | Yes        |
| reloadMode      | String  | "none"            | Yes        |
          

#### Settings Struct configuration

The settings struct contains the configuration for the feedback-hub-adapter-open-ai. The values are:

| Key              | Type     | Value                             | Required |
|------------------|----------|-----------------------------------|----------|
| apiKey           | String   | The OpenAI API key                | Yes      |
| languageModel    | String   | The ChatGPT language model to use | Yes      |

#### Example

The given example shows a valid configuration for the feedback-hub-adapter-open-ai adapter.
The list contains some additional and optional values that can be configured.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<CMSettings folder="/Settings/Options/Settings/Feedback Hub" name="OpenAI" xmlns:cmexport="http://www.coremedia.com/2012/cmexport">
<externalRefId></externalRefId>
<locale></locale>
<master/>
<settings><Struct xmlns="http://www.coremedia.com/2008/struct" xmlns:xlink="http://www.w3.org/1999/xlink">
<StringProperty Name="factoryId">OpenAI</StringProperty>
<StringProperty Name="groupId">OpenAI</StringProperty>
<StringProperty Name="contentType">CMArticle</StringProperty>
<BooleanProperty Name="enabled">true</BooleanProperty>
<StringProperty Name="reloadMode">none</StringProperty>
<StructProperty Name="settings">
<Struct>
  <StringProperty Name="apiKey">YOUR API KEY</StringProperty>
  <StringProperty Name="languageModel">text-davinci-003</StringProperty>
  <!-- These are the default settings and can be omitted -->
  <StringProperty Name="textProperty">detailText</StringProperty>
  <StringProperty Name="summaryProperty">teaserText</StringProperty>
  <StringProperty Name="titleProperty">title</StringProperty>
  <StringProperty Name="keywordsProperty">keywords</StringProperty>
  <StringProperty Name="headlineProperty">htmlTitle</StringProperty>
  <StringProperty Name="metadataProperty">htmlDescription</StringProperty>
  <IntProperty Name="maxTokens">1000</IntProperty>
  <IntProperty Name="temperature">30</IntProperty>
  <IntProperty Name="timeoutInSeconds">30</IntProperty>
  <!-- Customize the prompts to limit the response or manipulate the output -->
  <!-- These are the default settings and can be omitted -->
  <StringProperty Name="summaryPrompt">Summarize the following text</StringProperty>
  <StringProperty Name="keywordsPrompt">Extract the keywords from the following text with a total maximum length of 255 characters</StringProperty>
  <StringProperty Name="headlinePrompt">Create an article headline from the following text</StringProperty>
  <StringProperty Name="metadataPrompt">Summarize the following text in one sentence</StringProperty>
  <StringProperty Name="titlePrompt">Generate a title from the following text with a maximum length of 60 characters</StringProperty>
</Struct>
</StructProperty>
</Struct></settings>
<identifier></identifier>
</CMSettings>

```
