import React, { useState, useEffect } from "react";

interface KeysHandlerProps {
  onSubmit: (openaiKey: string, githubKey: string) => void;
}

const KeysHandler: React.FC<KeysHandlerProps> = ({ onSubmit }) => {
  const [openaiKey, setOpenaiKey] = useState(
    localStorage.getItem("openaiKey") || ""
  );
  const [githubKey, setGithubKey] = useState(
    localStorage.getItem("githubKey") || ""
  );

  useEffect(() => {
    localStorage.setItem("openaiKey", openaiKey);
    localStorage.setItem("githubKey", githubKey);
  }, [openaiKey, githubKey]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(openaiKey, githubKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Open AI Key:
        <input
          type="text"
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
        />
      </label>
      <label>
        Github Key:
        <input
          type="text"
          value={githubKey}
          onChange={(e) => setGithubKey(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default KeysHandler;
