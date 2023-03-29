import { useState } from "react";
import { Button, Input, Spin, Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { GithubFileObject, GithubObject } from "../common/github.interface";
import { StepHeading } from "../common/components";
import { LoadingOutlined } from "@ant-design/icons";
import {
  base64Decode,
  formatGithubURL,
  formatSize,
  isFolder,
  isImage,
} from "../utils/helper";

async function processContent(contents: GithubObject[]): Promise<DataNode[]> {
  const result: DataNode[] = [];

  for (const item of contents) {
    if (item.type === "file") {
      result.push({
        title: item.name + ` (size: ${formatSize(item.size)})`,
        key: item.path,
      });
    } else if (item.type === "dir") {
      const response = await fetch(item._links.self);
      const subContents = await response.json();
      const children = await processContent(subContents);
      result.push({
        title: item.name,
        key: item.path,
        children,
      });
    }
  }

  return result;
}

interface Props {
  onSubmit: (files: GithubFileObject[]) => void;
}
const SelectRepo = ({ onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [repoURL, setRepoURL] = useState<string>("");
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>();

  const loadRepo = async (repoURL: string) => {
    setRepoURL(repoURL);
    setIsLoading(true);

    try {
      const url = formatGithubURL(repoURL);
      const response = await fetch(
        `https://api.github.com/repos/${url}/contents/`
      );
      const contents = await response.json();
      const treeData = await processContent(contents);

      setTreeData(treeData);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = formatGithubURL(repoURL);
    const filenames =
      checkedKeys
        ?.map((f) => f.toString())
        .filter((f) => !isImage(f) && !isFolder(f)) || [];

    const files = await Promise.all(
      filenames.map((filename) =>
        fetch(`https://api.github.com/repos/${url}/contents/${filename}`).then(
          (res) => {
            const data = res.json().then((data) => {
              data.content = base64Decode(data.content);
              return data;
            });
            return data;
          }
        )
      )
    );

    setIsLoading(false);
    onSubmit(files);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <StepHeading>2. Select Repo</StepHeading>

      <Input.Search
        addonBefore="Github Public Repo URL:"
        placeholder="https://github.com/username/repo"
        allowClear
        onSearch={loadRepo}
        style={{ width: "100%" }}
      />

      {treeData.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <Tree
            checkable
            onCheck={(keys) => setCheckedKeys(keys as Key[])}
            checkedKeys={checkedKeys}
            treeData={treeData}
          />
        </div>
      )}
      {isLoading && (
        <Spin
          style={{ marginTop: 15 }}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
      )}
      {treeData.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <Button onClick={handleSubmit}>Load Files</Button>
        </div>
      )}
    </div>
  );
};

export default SelectRepo;
