import React from "react";

interface PromptQuerierProps {
  basedPrompt: string;
}

const PromptQuerier: React.FC<PromptQuerierProps> = ({ basedPrompt }) => {
  const [newPrompt, setNewPrompt] = React.useState(basedPrompt);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrompt(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="promptInput">Enter a prompt:</label>
        <input
          id="promptInput"
          type="text"
          value={newPrompt}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>

      <pre>Code goes her</pre>
    </div>
  );
};

export default PromptQuerier;
