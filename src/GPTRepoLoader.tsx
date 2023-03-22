import { useState } from "react";
import { Tree } from "antd";
import { Key } from "antd/es/table/interface";

interface GPTRepoLoaderProps {
  onSubmit: (sourceCode: string) => void;
}

interface FileNode {
  title: string;
  key: string;
  isLeaf: boolean;
}

const GPTRepoLoader: React.FC<GPTRepoLoaderProps> = ({ onSubmit }) => {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [treeData, setTreeData] = useState<FileNode[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoUrl}/contents/`
      );
      const contents = await response.json();
      const files = contents.filter((item: any) => item.type === "file");
      const sourceCode = files
        .map((file: any) => atob(file.content))
        .join("\n");
      const treeData = files.map((file: any) => ({
        title: file.name,
        key: file.path,
        isLeaf: true,
      }));
      setTreeData(treeData);
      setPrompt(sourceCode);
      onSubmit(sourceCode);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRepoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(event.target.value);
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
          <input type="text" value={repoUrl} onChange={handleRepoUrlChange} />
        </label>
        <button type="submit">Load Repo</button>
      </form>
      <Tree treeData={treeData} onSelect={handleFileSelect} />
      <pre>{prompt}</pre>
    </div>
  );
};

export default GPTRepoLoader;
