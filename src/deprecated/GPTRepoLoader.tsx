import { useState } from "react";
import { Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { base64Decode, formatGithubURL, isFolder, isImage } from "../helper";

interface GPTRepoLoaderProps {
  onSubmit: (prompt: string, fileContents: any[]) => void;
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

  const generatePrompt = async () => {
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

    let prompt = `The following text is a Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\r\n`;
    fileContents.forEach((fileContent) => {
      const { path, content } = fileContent;
      prompt += `\r\n----\r\n${path}\r\n${content}\r\n`;
    });
    prompt += `\r\n--END--\r\n\r\n`;

    onSubmit(prompt, fileContents);
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

      <button onClick={generatePrompt}>DONE!</button>
    </div>
  );
};

export default GPTRepoLoader;
