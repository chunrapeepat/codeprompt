import { Button, Card, Input } from "antd";
import { useState } from "react";
import { StepHeading } from "../common/components";
import { GithubFileObject } from "../common/github.interface";
import { countTokens, numberWithCommas } from "../utils/helper";

const promptTemplate = `The following text is a Git repository with code. The structure of the text is sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the repository ends when the symbols --END-- are encountered. Any further text beyond --END-- is meant to be interpreted as instructions using the aforementioned code as context.
$GIT_REPO_FILES$
--END--
$INSTRUCTION$`;

interface ConfigPromptProps {
  files: GithubFileObject[];
  onSubmit: (prompt: string) => void;
}
const ConfigPrompt = ({ files, onSubmit }: ConfigPromptProps) => {
  const [instruction, setInstruction] = useState<string>("");

  const handleSubmit = () => {
    const prompt = "This is a prompt";
    onSubmit(prompt);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <StepHeading>3. Config Prompt</StepHeading>
      <Card
        size="small"
        title="Instruction"
        extra={
          <div style={{ color: "#555", fontStyle: "italic" }}>
            Token Count: {numberWithCommas(countTokens(instruction))}
          </div>
        }
      >
        <Input.TextArea
          rows={3}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </Card>
      <Button style={{ marginTop: 15 }} onClick={handleSubmit}>
        Generate Prompt
      </Button>
    </div>
  );
};

export default ConfigPrompt;
