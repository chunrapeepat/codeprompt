import { Button, Card, Divider, Input, Progress } from "antd";
import { useEffect, useMemo, useState } from "react";
import { StepHeading } from "../common/components";
import { GithubFileObject } from "../common/github.interface";
import { countTokens, numberWithCommas } from "../utils/helper";
import MonacoEditor from "@monaco-editor/react";

const promptTemplate = `The following text is a Git repository with code. The structure of the text is sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the repository ends when the symbols --END-- are encountered. Any further text beyond --END-- is meant to be interpreted as instructions using the aforementioned code as context.
$GIT_REPO_FILES$
--END--
$INSTRUCTION$`;
const defaultTemplateTokenUsed = countTokens(
  promptTemplate.replace("$INSTRUCTION$", "").replace("$GIT_REPO_FILES$", "")
);

interface ConfigPromptProps {
  model: any;
  files: GithubFileObject[];
  onSubmit: (prompt: string) => void;
}
const ConfigPrompt = ({ model, files, onSubmit }: ConfigPromptProps) => {
  const [instruction, setInstruction] = useState<string>("");
  const [editedFiles, setEditedFiles] =
    useState<
      (GithubFileObject & { isExpanded?: boolean; tokenUsed?: number })[]
    >(files);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const instructionTokenUsed = useMemo(
    () => countTokens(instruction),
    [instruction]
  );
  useEffect(() => {
    const newEditedFiles = editedFiles.map((file) => {
      file.tokenUsed = countTokens(file.content);
      return file;
    });
    setEditedFiles(newEditedFiles);
  }, []);

  const totalTokenUsed =
    editedFiles.map((file) => file.tokenUsed || 0).reduce((a, b) => a + b) +
    instructionTokenUsed +
    defaultTemplateTokenUsed;
  const tokenUsedPercentage = 100 * (totalTokenUsed / model.maxTokens);

  const handleSubmit = () => {
    const prompt = promptTemplate
      .replace("$INSTRUCTION$", instruction)
      .replace(
        "$GIT_REPO_FILES$",
        editedFiles
          .map((file) => `----\n${file.path}\n${file.content}`)
          .join("\n")
      );

    onSubmit(prompt);
  };

  const handleEditorChange = (index: number, value: string | undefined) => {
    const newFiles = [...editedFiles];
    if (value !== undefined) {
      newFiles[index].content = value;
    }
    setEditedFiles(newFiles);

    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      const newFiles = [...editedFiles];
      newFiles[index].tokenUsed = countTokens(value || "");
      setEditedFiles(newFiles);
    }, 500);
    setTimeoutId(newTimeoutId);
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
              Token used: {numberWithCommas(file.tokenUsed || 0)}
            </div>
          }
        >
          {file.isExpanded && (
            <MonacoEditor
              height={500}
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
            Token used: {numberWithCommas(instructionTokenUsed)}
          </div>
        }
      >
        <Input.TextArea
          rows={3}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </Card>

      <div
        style={{
          background: "#f7f7f7",
          padding: "10px 15px 0px 15px",
          borderRadius: 15,
          marginTop: 25,
        }}
      >
        <span
          style={{
            color: "#555",
            fontStyle: "italic",
            fontSize: "0.875rem",
            fontWeight: 500,
            display: "block",
          }}
        >
          Token used: {numberWithCommas(totalTokenUsed)} /{" "}
          {numberWithCommas(model.maxTokens)} ({model.name})
        </span>
        <Progress
          percent={tokenUsedPercentage}
          showInfo={false}
          status={tokenUsedPercentage >= 100 ? "exception" : "active"}
        />
      </div>
      <Button
        style={{ marginTop: 10 }}
        onClick={handleSubmit}
        disabled={tokenUsedPercentage >= 100}
      >
        Generate Prompt
      </Button>
    </div>
  );
};

export default ConfigPrompt;
