import { Configuration, OpenAIApi } from "openai";
// import { encoding_for_model as encodingForModel } from "@dqbd/tiktoken";

const model = "gpt-3.5-turbo";
// const encoder = encodingForModel(model);

export const generateResponse = async (prompt: string, apiKey: string) => {
  // if (encoder.encode(prompt).length > 4000) {
  //   throw new Error(
  //     "The diff is too large for the OpenAI API. Try reducing the number of staged changes, or write your own commit message."
  //   );
  // }

  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful developer assistant. Output in a format of filename followed by code block. Without any explanation messages.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return completion.data.choices[0].message?.content;
};
