import { Button, Select } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { StepHeading } from "../common/components";
import MODELS from "../common/models";
import { numberWithCommas } from "../utils/helper";

const { Option } = Select;

const ModelInfo = styled.div`
  background: #e5f3f3;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 15px 0;

  & p > span {
    margin-right: 15px;
  }
`;

interface SelectModelProps {
  onSelectionChange: (value: string) => void;
}
const SelectModel = ({ onSelectionChange }: SelectModelProps) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleChange = (value: any) => {
    setSelectedItem(value);
  };
  const handleSubmit = () => {
    if (!selectedItem) return;
    onSelectionChange(selectedItem);
  };

  return (
    <div>
      <StepHeading>1. Select Model</StepHeading>

      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a models"
        optionFilterProp="children"
        onChange={handleChange}
      >
        <Option value="gpt-3.5">GPT-3.5</Option>
        <Option value="gpt-4">GPT-4</Option>
        <Option value="gpt-4-32k">GPT-4-32K</Option>
      </Select>

      {selectedItem && (
        <>
          <ModelInfo>
            <p>
              <span>
                <b>Model:</b> {MODELS[selectedItem].name}
              </span>
              <span>
                <b>Max Tokens:</b>{" "}
                {numberWithCommas(MODELS[selectedItem].maxTokens)}
              </span>
            </p>
            <p>{MODELS[selectedItem].description}</p>
            <p>
              <b>Training Data:</b> {MODELS[selectedItem].trainingData}
            </p>
          </ModelInfo>

          <Button onClick={handleSubmit}>Select Model</Button>
        </>
      )}
    </div>
  );
};

export default SelectModel;
