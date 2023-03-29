import { Button, Select } from "antd";
import { useState } from "react";
import MODELS from "../common/models";

const { Option } = Select;

interface Props {
  onSelectionChange: (value: string) => void;
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
      <h2>Select Model</h2>

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
                <b>Model:</b> {MODELS[selectedItem].name}
              </span>
              <span>
                <b>Max Tokens:</b> {MODELS[selectedItem].maxTokens}
              </span>
            </p>
            <p>{MODELS[selectedItem].description}</p>
            <p>
              <b>Training data:</b> {MODELS[selectedItem].trainingData}
            </p>
          </div>

          <Button onClick={handleSubmit}>Select Model</Button>
        </>
      )}
    </div>
  );
};

export default SelectModel;
