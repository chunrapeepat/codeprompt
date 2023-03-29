import React from "react";
import { Steps } from "antd";
import styled from "styled-components";
import SelectModel from "./SelectModel";
import MODELS from "./common/models";

const Container = styled.div`
  width: 800px;
  margin: auto auto;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 20px;
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

  return (
    <Container>
      <Header />

      <Grid>
        <div>
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
                title: "Generate Prompt",
                description: "Generate the prompt for the selected model",
              },
            ]}
          />
        </div>
        <div>
          <SelectModel
            onSelectionChange={(modelId) => {
              setSelectedModel(MODELS[modelId]);
              setStep(Math.min(step + 1, 4));
            }}
          />

          {step >= 1 && (
            <div>
              <h2>Select Repo</h2>
            </div>
          )}
        </div>
      </Grid>
      <Footer />
    </Container>
  );
}

export default App;
