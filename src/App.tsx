import React, { useState } from "react";
import KeysHandler from "./KeysHandler";

function App() {
  // Step 1: Handle Keys
  const [openAIKey, setOpenAIKey] = useState(
    localStorage.getItem("openaiKey") || ""
  );
  const [githubKey, setGithubKey] = useState(
    localStorage.getItem("githubKey") || ""
  );
  const handleKeysSubmit = (openAIKey: string, githubKey: string) => {
    setOpenAIKey(openAIKey);
    setGithubKey(githubKey);
  };

  return (
    <div>
      <h1>GPTCoder</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente,
        fugit temporibus natus voluptatum animi ex, quas nobis eos consequatur
        modi sit quos hic sunt praesentium corrupti explicabo beatae
        perspiciatis error.
      </p>

      <KeysHandler onSubmit={handleKeysSubmit} />
    </div>
  );
}

export default App;
