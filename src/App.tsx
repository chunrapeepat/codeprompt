import React from "react";
import { Steps } from "antd";
import styled from "styled-components";
import SelectModel from "./steps/SelectModel";
import MODELS from "./common/models";
import SelectRepo from "./steps/SelectRepo";
import { GithubFileObject } from "./common/github.interface";
import ConfigPrompt from "./steps/ConfigPrompt";

const Container = styled.div`
  width: 800px;
  margin: auto auto;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 30px;
`;
const Sticky = styled.div`
  position: sticky;
  top: 30px;
`;
const Header = () => {
  return (
    <div>
      <h1>Codeprompt</h1>
      <p>
        The repository loader interface for generating the GPT prompt. Inspired
        by mpoon/gpt-repository-loader.
      </p>
    </div>
  );
};
const Footer = () => {
  return (
    <div>
      <p>
        Made with ❤️ by{" "}
        <a href="" target="_blank" rel="noopener noreferrer">
          @chunrapeepat
        </a>
      </p>
    </div>
  );
};

function App() {
  const [step, setStep] = React.useState(0);
  const [selectedModel, setSelectedModel] = React.useState(null);
  const [files, setFiles] = React.useState<GithubFileObject[]>([]);
  const [prompt, setPrompt] = React.useState<string>("");

  return (
    <Container>
      <Header />

      <Grid>
        <div>
          <Sticky>
            <Steps
              direction="vertical"
              size="small"
              current={step}
              items={[
                {
                  title: "Select Model",
                  description: "Select the GPT model",
                },
                {
                  title: "Select Repo",
                  description: "Select the Github repo",
                },
                {
                  title: "Config Prompt",
                  description: "Config the prompt",
                },
                {
                  title: "Finish",
                  description: "Copy the prompt to GPT",
                },
              ]}
            />
          </Sticky>
        </div>
        <div>
          <SelectModel
            onSelectionChange={(modelId) => {
              setSelectedModel(MODELS[modelId]);

              if (step > 1) return;
              setStep(Math.min(step + 1, 1));
            }}
          />

          {step >= 1 && (
            <SelectRepo
              onSubmit={(files) => {
                setFiles(files);

                if (step > 2) return;
                setStep(Math.min(step + 1, 2));
              }}
            />
          )}

          {step >= 2 && (
            <ConfigPrompt
              files={files}
              onSubmit={(prompt) => {
                setPrompt(prompt);

                if (step > 3) return;
                setStep(Math.min(step + 1, 3));
              }}
            />
          )}

          {step >= 3 && <div>This is a prompt {prompt}</div>}
        </div>
      </Grid>
      <Footer />
    </Container>
  );
}

export default App;
