---
id: obsidian-textgenerator-plugin
name: Text Generator
source: vault-native
plugin-type: community
status: disabled
class: PARTIAL
description: "Text generation using AI"
has-settings: true
needs-setup: true
---

# Text Generator

**Description:** Text generation using AI
**Status:** Disabled
**Plugin ID:** obsidian-textgenerator-plugin

## Setup Required

Plugin is disabled. Use enable_plugin to activate it first.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Configuration File

Settings path: `.obsidian/plugins/obsidian-textgenerator-plugin/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-textgenerator-plugin/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-textgenerator-plugin/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
endpoint: https://api.openai.com/v1
encrypt_keys: false
selectedProvider: Default (Custom)
temperature: 0.7
frequency_penalty: 0.5
showStatusBar: true
outputToBlockQuote: true
freeCursorOnStreaming: false
allowJavascriptRun: false
experiment: false
promptsPath: Templates/textgenerator
textGenPath: textgenerator/
prefix: 


tgSelectionLimiter: ^\*\*\*
stream: true
context:
  customInstructEnabled: true
  includeClipboard: true
  customInstruct: Title: {{title}}
  
Starred Blocks: {{starredBlocks}}
	  
{{tg_selection}}
  contextTemplate: Title: {{title}}
	
Starred Blocks: {{starredBlocks}}
	  
{{tg_selection}}
requestTimeout: 300000
options:
  generate-text: true
  generate-text-with-metadata: true
  insert-generated-text-From-template: true
  create-generated-text-From-template: false
  search-results-batch-generate-from-template: true
  insert-text-From-template: false
  create-text-From-template: false
  show-modal-From-template: true
  open-template-as-tool: true
  open-playground: true
  set-llm: true
  set-model: true
  packageManager: true
  create-template: false
  get-title: true
  generated-text-to-clipboard-From-template: false
  text-extractor-tool: true
  stop-stream: true
  custom-instruct: true
  generate-in-right-click-menu: false
  batch-generate-in-right-click-files-menu: true
  tg-block-processor: true
  reload: true
  disable-ribbon-icons: false
  overlay-toolbar: false
  log-slowest-operations: false
advancedOptions:
  generateTitleInstructEnabled: false
  generateTitleInstruct: Generate a title for the current document (do not use * " \ / < > : | ? .):
{{substring content 0 255}}
  includeAttachmentsInRequest: false
autoSuggestOptions:
  customInstructEnabled: true
  customInstruct: Continue the follwing text:
Title: {{title}}
{{query}}
  isEnabled: false
  allowInNewLine: false
  delay: 300
  numberOfSuggestions: 5
  triggerPhrase:   
  stop: .
  showStatus: true
  customProvider: false
  inlineSuggestions: false
  overrideTrigger:  
slashSuggestOptions:
  isEnabled: false
  triggerPhrase: /
extractorsOptions:
  PDFExtractor: true
  WebPageExtractor: true
  YoutubeExtractor: true
  AudioExtractor: false
  ImageExtractorEmbded: true
  ImageExtractor: true
displayErrorInEditor: false
LLMProviderOptions:
  whisper:
    base_path: https://api.openai.com/v1
    model: whisper-1
  OpenAI Chat (Langchain):
    basePath: https://api.openai.com/v1
    model: gpt-4o
    reasoningEffort: medium
  Anthropic Legacy (Custom):
    endpoint: https://api.anthropic.com/v1/messages
    custom_header: {
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json",
    "x-api-key":  "{{api_key}}"
}
    custom_body: {
    model: "{{model}}",
    stream: {{stream}},
    max_tokens: {{max_tokens}},
    messages: {{stringify messages}}
}
    model: claude-2.1
    n: 1
    sanatization_streaming: [string, 803 chars]
    sanatization_response: async (data, res)=>{
    // catch error
    if (res.status >= 300) {
      const err = data?.error?.message || JSON.stringify(data);
      throw err;
    }
  
    // get choices
    const choices = data.content.map(c=> ({role:"assistant", content:c.text}));
  
    // the return object should be in the format of 
    // { content: string }[] 
    // if there's only one response, put it in the array of choices.
    return choices;
  }
    CORSBypass: true
    streamable: false
  OpenAI Agent (Langchain):
    basePath: https://api.openai.com/v1
    model: o1-mini
    reasoningEffort: medium
  Google GenerativeAI (Langchain):
    model: gemini-2.0-flash
    enableThinking: false
  Chat Anthropic (Langchain):
    basePath: https://api.anthropic.com/
    model: claude-sonnet-4-6
    enableThinking: false
    thinkingBudget: 10000
  Perplexity (Langchain):
    basePath: https://api.perplexity.ai
    model: sonar
```
(6 sensitive field(s) redacted)

For full settings, read: `.obsidian/plugins/obsidian-textgenerator-plugin/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-textgenerator-plugin.readme.md")

## Usage

This plugin is currently disabled. Use enable_plugin("obsidian-textgenerator-plugin") to activate it first.
After enabling, the plugin's commands will become available for execute_command.
