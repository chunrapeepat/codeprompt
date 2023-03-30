import { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spin, Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { GithubFileObject, GithubObject } from "../common/github.interface";
import { StepHeading } from "../common/components";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  base64Decode,
  formatGithubURL,
  formatSize,
  isFolder,
  isImage,
} from "../utils/helper";

async function processContent(
  contents: GithubObject[],
  accessToken: string
): Promise<DataNode[]> {
  const result: DataNode[] = [];

  for (const item of contents) {
    if (item.type === "file") {
      result.push({
        title: item.name + ` (size: ${formatSize(item.size)})`,
        key: item.path,
      });
    } else if (item.type === "dir") {
      const response = await fetch(
        item._links.self,
        accessToken
          ? {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          : {}
      );
      const subContents = await response.json();
      const children = await processContent(subContents, accessToken);
      result.push({
        title: item.name,
        key: item.path,
        children,
      });
    }
  }

  return result;
}

interface SelectRepoProps {
  onSubmit: (files: GithubFileObject[]) => void;
}
const SelectRepo = ({ onSubmit }: SelectRepoProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [repoURL, setRepoURL] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>();
  const [usePrivateRepo, setUsePrivateRepo] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("github_access_token");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const saveAccessToken = () => {
    localStorage.setItem("github_access_token", accessToken);
  };

  const loadRepo = async (repoURL: string) => {
    setRepoURL(repoURL);
    setIsLoading(true);

    try {
      const url = formatGithubURL(repoURL);
      const response = await fetch(
        `https://api.github.com/repos/${url}/contents/`,
        usePrivateRepo
          ? {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          : {}
      );
      
      const contents = await response.json();
      if (response.status !== 200) {
        throw new Error(contents.message);
      }
      const treeData = await processContent(contents, accessToken);

      setTreeData(treeData);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
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
        fetch(
          `https://api.github.com/repos/${url}/contents/${filename}`,
          accessToken
            ? {
                headers: {
                  Authorization: `token ${accessToken}`,
                },
              }
            : {}
        ).then((res) => {
          const data = res.json().then((data) => {
            data.content = base64Decode(data.content);
            return data;
          });
          return data;
        })
      )
    );

    setIsLoading(false);
    onSubmit(files);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <StepHeading>Select Repo & Files</StepHeading>

      {error && (
        <div style={{ color: "red", marginTop: 10, marginBottom: 20 }}>{error}</div>
      )}

      <Input.Search
        addonBefore="Github Repo URL:"
        placeholder="https://github.com/username/repo"
        allowClear
        onSearch={loadRepo}
        style={{ width: "100%" }}
      />
      <Checkbox
        style={{ marginTop: 10 }}
        checked={usePrivateRepo}
        onChange={(e) => setUsePrivateRepo(e.target.checked)}
      >
        Use private repo
      </Checkbox>

      {usePrivateRepo && (
        <div style={{ marginTop: 10 }}>
          <Input
            addonBefore="Github Access Token:"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            style={{ width: "100%" }}
            type="password"
          />

          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <div
              style={{
                color: "#555",
                fontStyle: "italic",
                fontSize: "0.875rem",
                marginLeft: 12,
              }}
            >
              <a
                style={{ color: "#555" }}
                href="https://github.com/settings/tokens/new"
                target="_blank"
              >
                Get access token
              </a>{" "}
              (select "repo" scopes)
            </div>
            <Button onClick={saveAccessToken}>Save to Local Storage</Button>
          </div>
        </div>
      )}

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
