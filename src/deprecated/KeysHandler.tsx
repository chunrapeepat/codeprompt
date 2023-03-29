import React, { useState, useEffect } from "react";

interface KeysHandlerProps {
  onSubmit: (openAIKey: string) => void;
}

const KeysHandler: React.FC<KeysHandlerProps> = ({ onSubmit }) => {
  const [openAIKey, setopenAIKey] = useState(
    localStorage.getItem("openAIKey") || ""
  );

  useEffect(() => {
    localStorage.setItem("openAIKey", openAIKey);
  }, [openAIKey]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(openAIKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Open AI Key:
        <input
          type="text"
          value={openAIKey}
          onChange={(e) => setopenAIKey(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default KeysHandler;
