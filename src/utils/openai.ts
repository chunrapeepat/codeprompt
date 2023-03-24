import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
// import { encoding_for_model as encodingForModel } from "@dqbd/tiktoken";

const model = "gpt-3.5-turbo";
// const encoder = encodingForModel(model);

export const generateResponse = async (
  prompts: ChatCompletionRequestMessage[],
  apiKey: string
) => {
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
          "You are a helpful developer assistant. Output in a format of filename followed by code block without any explanation messages. Once you output everything based on the user's prompt, end the output with ---END---",
      },
      ...prompts,
    ],
    temperature: 0.2,
  });

  return completion.data.choices[0].message?.content || "";
};
