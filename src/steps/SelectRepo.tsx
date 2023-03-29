import { useState } from "react";
import { Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { base64Decode, formatGithubURL, isFolder, isImage } from "../helper";
import { GithubFileObject, GithubObject } from "../common/github.interface";

async function processContent(contents: GithubObject[]): Promise<DataNode[]> {
  const result: DataNode[] = [];

  for (const item of contents) {
    if (item.type === "file") {
      result.push({
        title: item.name + ` (size: ${item.size})`,
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
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>();

  const loadRepoStructure = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoUrl}/contents/`
      );
      const contents = await response.json();
      const treeData = await processContent(contents);

      setTreeData(treeData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRepoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(formatGithubURL(event.target.value));
  };

  const handleSubmit = async () => {
    const filenames =
      checkedKeys
        ?.map((f) => f.toString())
        .filter((f) => !isImage(f) && !isFolder(f)) || [];

    const fileContents = await Promise.all(
      filenames.map((filename) =>
        fetch(
          `https://api.github.com/repos/${repoUrl}/contents/${filename}`
        ).then((res) => {
          const data = res.json().then((data) => {
            data.content = base64Decode(data.content);
            return data;
          });
          return data;
        })
      )
    );

    onSubmit(fileContents);
  };

  return (
    <div>
      <h2>Select Repo</h2>
      <form onSubmit={loadRepoStructure}>
        <label>
          Github Repo URL:
          <input type="text" onChange={handleRepoUrlChange} />
        </label>
        <button type="submit">Load Repo</button>
      </form>
      <Tree
        checkable
        onCheck={(keys) => setCheckedKeys(keys as Key[])}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />

      <button onClick={handleSubmit}>DONE!</button>
    </div>
  );
};

export default SelectRepo;
