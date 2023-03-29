import { Button } from "antd";
import { GithubFileObject } from "../common/github.interface";

interface ConfigPromptProps {
  files: GithubFileObject[];
  onSubmit: (prompt: string) => void;
}
const ConfigPrompt = ({ files, onSubmit }: ConfigPromptProps) => {
  const handleSubmit = () => {
    const prompt = "This is a prompt";
    onSubmit(prompt);
  };

  return (
    <div>
      <h2>Config Prompt</h2>
      <Button onClick={handleSubmit}>Generate Prompt</Button>
    </div>
  );
};

export default ConfigPrompt;
