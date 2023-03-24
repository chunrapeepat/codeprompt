import { encode } from "gpt-token-utils";
import { ChatCompletionRequestMessage } from "openai";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import { generateResponse } from "./utils/openai";

interface PromptQuerierProps {
  basedPrompt: string;
  openAIKey: string;
  fileContents: any[];
}

const PromptQuerier: React.FC<PromptQuerierProps> = ({
  basedPrompt,
  openAIKey,
  fileContents,
}) => {
  const [code, setCode] = React.useState("");
  const [instructionPrompt, setInstructionPrompt] = React.useState(basedPrompt);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstructionPrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = basedPrompt + "\r\n" + instructionPrompt;
    console.log("prompt token = ", encode(prompt).length);

    const prompts: ChatCompletionRequestMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];
    let msg = await generateResponse(prompts, openAIKey);
    const result = [msg];
    while (!msg?.includes("---END---")) {
      prompts.push({
        role: "assistant",
        content: msg,
      });
      prompts.push({
        role: "user",
        content: "continue",
      });
      msg = await generateResponse(prompts, openAIKey);
      result.push(msg);
    }

    console.log("debug", result);
    // setCode(res || "");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="promptInput">Enter a prompt:</label>
        <input
          id="promptInput"
          type="text"
          value={instructionPrompt}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>

      {/* {code && (
        <ReactDiffViewer
          oldValue={(fileContents[0] || { content: "" }).content}
          newValue={code}
          splitView={true}
        />
      )} */}
    </div>
  );
};

export default PromptQuerier;
