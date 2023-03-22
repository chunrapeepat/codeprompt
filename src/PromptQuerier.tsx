import React from "react";
import { generateResponse } from "./utils/openai";

interface PromptQuerierProps {
  basedPrompt: string;
  openAIKey: string;
}

const PromptQuerier: React.FC<PromptQuerierProps> = ({
  basedPrompt,
  openAIKey,
}) => {
  const [code, setCode] = React.useState("");
  const [instructionPrompt, setInstructionPrompt] = React.useState(basedPrompt);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstructionPrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = basedPrompt + "\r\n" + instructionPrompt;

    const res = await generateResponse(prompt, openAIKey);
    setCode(res || "");
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

      <pre>{code}</pre>
    </div>
  );
};

export default PromptQuerier;
