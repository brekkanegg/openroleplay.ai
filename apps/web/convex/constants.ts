export const DEFAULT_MODEL = "gpt-3.5-turbo-1106";
export const PERPLEXITY_API_URL = "https://api.perplexity.ai";
export const OPENAI_API_URL = "https://api.openai.com/v1";
export const FIREWORK_API_URL = "https://api.fireworks.ai/inference/v1";

export const getBaseURL = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
      return PERPLEXITY_API_URL;
    case "accounts/fireworks/models/qwen-14b-chat":
      return FIREWORK_API_URL;
    default:
      return OPENAI_API_URL;
  }
};

export const getAPIKey = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
      return process.env.PERPLEXITY_API_KEY;
    case "accounts/fireworks/models/qwen-14b-chat":
      return process.env.FIREWORKS_API_KEY;
    default:
      return process.env.OPENAI_API_KEY;
  }
};

export const getRemindInstructionInterval = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
      return 16;
    case "accounts/fireworks/models/qwen-14b-chat":
      return 64;
    default:
      return 64;
  }
};

export const getCrystalPrice = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
      return 3;
    case "mistral-7b-instruct":
      return 1;
    case "pplx-7b-online":
      return 2;
    case "accounts/fireworks/models/qwen-14b-chat":
      return 2;
    case "gpt-3.5-turbo-1106":
      return 5;
    default:
      return 5;
  }
};
