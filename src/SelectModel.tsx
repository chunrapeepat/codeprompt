import { Button, Select } from "antd";
import { useState } from "react";

const { Option } = Select;

const modelData: { [key: string]: any } = {
  "gpt-3.5": {
    name: "GPT-3.5-TURBO",
    description:
      "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.",
    maxTokens: "4,096",
    trainingData: "Up to Sep 2021",
  },
  "gpt-4": {
    name: "GPT-4",
    description:
      "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration.",
    maxTokens: "8,192",
    trainingData: "Up to Sep 2021",
  },
  "gpt-4-32k": {
    name: "GPT-4-32K",
    description:
      "Same capabilities as the base gpt-4 mode but with 4x the context length. Will be updated with our latest model iteration.",
    maxTokens: "32,768",
    trainingData: "Up to Sep 2021",
  },
};

interface Props {
  onSelectionChange: (value: any) => void;
}
const SelectModel = ({ onSelectionChange }: Props) => {
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
          <div>
            <p>
              <span>
                <b>Model:</b> {modelData[selectedItem].name}
              </span>
              <span>
                <b>Max Tokens:</b> {modelData[selectedItem].maxTokens}
              </span>
            </p>
            <p>{modelData[selectedItem].description}</p>
            <p>
              <b>Training data:</b> {modelData[selectedItem].trainingData}
            </p>
          </div>

          <Button onClick={handleSubmit}>Select Model</Button>
        </>
      )}
    </div>
  );
};

export default SelectModel;
