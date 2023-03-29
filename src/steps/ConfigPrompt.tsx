import { Button, Card, Input } from "antd";
import { useState } from "react";
import { StepHeading } from "../common/components";
import { GithubFileObject } from "../common/github.interface";
import { countTokens, numberWithCommas } from "../utils/helper";
import MonacoEditor from "@monaco-editor/react";

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
  const [editedFiles, setEditedFiles] =
    useState<(GithubFileObject & { isExpanded?: boolean })[]>(files);

  const handleSubmit = () => {
    const prompt = "This is a prompt";
    onSubmit(prompt);
  };

  const handleEditorChange = (index: number, value: string | undefined) => {
    const newFiles = [...editedFiles];
    if (value !== undefined) {
      newFiles[index].content = value;
    }
    setEditedFiles(newFiles);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <StepHeading>3. Config Prompt</StepHeading>
      {editedFiles.map((file, index) => (
        <Card
          key={index}
          title={
            <div
              style={{ fontFamily: "Source Code Pro", cursor: "pointer" }}
              onClick={() => {
                const newFiles = [...editedFiles];
                newFiles[index].isExpanded = !newFiles[index].isExpanded;
                setEditedFiles(newFiles);
              }}
            >
              {file.path}{" "}
              <span style={{ color: "#a3a3a3", fontWeight: 400 }}>
                (click to {file.isExpanded ? "collapse" : "expand"})
              </span>
            </div>
          }
          style={{ marginBottom: 20 }}
          size="small"
          extra={
            <div style={{ color: "#555", fontStyle: "italic" }}>
              Token used: {numberWithCommas(countTokens(file.content))}
            </div>
          }
        >
          {file.isExpanded && (
            <MonacoEditor
              height={400}
              value={file.content}
              options={{
                minimap: { enabled: false },
              }}
              onChange={(value) => handleEditorChange(index, value)}
            />
          )}
          {!file.isExpanded && (
            <span
              style={{
                color: "#777",
                fontWeight: 400,
                position: "absolute",
                bottom: 4,
              }}
            >
              ...
            </span>
          )}
        </Card>
      ))}

      <Card
        size="small"
        title="Instruction"
        extra={
          <div style={{ color: "#555", fontStyle: "italic" }}>
            Token used: {numberWithCommas(countTokens(instruction))}
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
