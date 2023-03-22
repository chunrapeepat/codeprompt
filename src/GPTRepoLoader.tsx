import { useState } from "react";
import { Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { formatGithubURL } from "./helper";

interface GPTRepoLoaderProps {
  onSubmit: (prompt: string) => void;
}

interface GithubObject {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}
async function processContent(contents: GithubObject[]): Promise<DataNode[]> {
  const result: DataNode[] = [];

  for (const item of contents) {
    if (item.type === "file") {
      result.push({
        title: item.name,
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

const GPTRepoLoader: React.FC<GPTRepoLoaderProps> = ({ onSubmit }) => {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>();
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

  const handleFileSelect = (selectedKeys: Key[]) => {
    const selectedFile = treeData.find(
      (file) => file.key.toString() === selectedKeys[0].toString()
    );
    if (selectedFile) {
      const fileUrl = `https://raw.githubusercontent.com/${repoUrl}/main/${selectedFile.title}`;
      fetch(fileUrl)
        .then((response) => response.text())
        .then((sourceCode) => setPrompt(sourceCode))
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
      <pre>{prompt}</pre>

      <button
        onClick={() => {
          console.log("debug", checkedKeys);
        }}
      >
        DONE!
      </button>
    </div>
  );
};

export default GPTRepoLoader;
