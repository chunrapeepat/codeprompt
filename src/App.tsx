import React, { useState } from "react";
import GPTRepoLoader from "./GPTRepoLoader";
import KeysHandler from "./KeysHandler";

function App() {
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

      <h2>Step 1: Keys</h2>
      <KeysHandler onSubmit={handleKeysSubmit} />

      <h2>Step 2: GPTRepoLoader</h2>
      <GPTRepoLoader onSubmit={console.log} />
    </div>
  );
}

export default App;
