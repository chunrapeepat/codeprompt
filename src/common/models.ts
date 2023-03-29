const MODELS: { [key: string]: any } = {
  "gpt-3.5": {
    name: "GPT-3.5-TURBO",
    description:
      "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.",
    maxTokens: 4096,
    trainingData: "Up to Sep 2021",
  },
  "gpt-4": {
    name: "GPT-4",
    description:
      "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration.",
    maxTokens: 8192,
    trainingData: "Up to Sep 2021",
  },
  "gpt-4-32k": {
    name: "GPT-4-32K",
    description:
      "Same capabilities as the base gpt-4 mode but with 4x the context length. Will be updated with our latest model iteration.",
    maxTokens: 32768,
    trainingData: "Up to Sep 2021",
  },
};

export default MODELS;
