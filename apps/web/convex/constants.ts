export const SIGN_UP_FREE_CRYSTALS = 1000;
export const DEFAULT_MODEL = "gpt-3.5-turbo-1106";
export const PERPLEXITY_API_URL = "https://api.perplexity.ai";
export const OPENAI_API_URL = "https://api.openai.com/v1";
export const FIREWORK_API_URL = "https://api.fireworks.ai/inference/v1";
export const STABILITY_AI_API_URL =
  "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
export const MISTRAL_AI_API_URL = "https://api.mistral.ai/v1";

export const getBaseURL = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
    case "pplx-7b-chat":
    case "pplx-70b-online":
    case "pplx-70b-chat":
      return PERPLEXITY_API_URL;
    case "accounts/fireworks/models/qwen-14b-chat":
      return FIREWORK_API_URL;
    case "mistral-tiny":
    case "mistral-small":
    case "mistral-medium":
      return MISTRAL_AI_API_URL;
    default:
      return OPENAI_API_URL;
  }
};

export const getAPIKey = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
    case "pplx-7b-chat":
    case "pplx-70b-online":
    case "pplx-70b-chat":
      return process.env.PERPLEXITY_API_KEY;
    case "accounts/fireworks/models/qwen-14b-chat":
      return process.env.FIREWORKS_API_KEY;
    case "mistral-tiny":
    case "mistral-small":
    case "mistral-medium":
      return process.env.MISTRAL_API_KEY;
    default:
      return process.env.OPENAI_API_KEY;
  }
};

export const getRemindInstructionInterval = (modelName: string) => {
  switch (modelName) {
    case "mixtral-8x7b-instruct":
    case "mistral-7b-instruct":
    case "pplx-7b-online":
    case "pplx-7b-chat":
      return 16;
    case "accounts/fireworks/models/qwen-14b-chat":
    case "pplx-70b-online":
    case "pplx-70b-chat":
      return 64;
    case "mistral-tiny":
    case "mistral-small":
    case "mistral-medium":
      return 128;
    case "gpt-4-1106-preview":
      return 128;
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
    case "pplx-7b-chat":
      return 1;
    case "pplx-7b-online":
      return 2;
    case "pplx-70b-online":
      return 5;
    case "pplx-70b-chat":
      return 5;
    case "accounts/fireworks/models/qwen-14b-chat":
      return 2;
    case "gpt-3.5-turbo-1106":
      return 5;
    case "stable-diffusion-xl-1024-v1-0":
      return 30;
    case "gpt-4-1106-preview":
      return 30;
    case "dalle-3":
      return 100;
    case "mistral-tiny":
      return 5;
    case "mistral-small":
      return 10;
    case "mistral-medium":
      return 15;
    default:
      return 5;
  }
};

export const crystalDollarPrice = {
  300: "99",
  1650: "499",
  5450: "1499",
  11200: "2999",
  19400: "4999",
  90000: "9999",
};
