import { useEffect, useState } from "react";
import { Button, Checkbox, Divider, Input, Spin, Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { GithubFileObject, GithubObject } from "../common/github.interface";
import { StepHeading } from "../common/components";
import {
  CloseOutlined,
  LoadingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  base64Decode,
  formatGithubURL,
  formatSize,
  isFolder,
  isImage,
} from "../utils/helper";
import styled from "styled-components";

const FavoriteRepos = styled.div`
  margin-bottom: 20px;

  & > div {
    cursor: pointer;
    background: #fefefe;
    border: 1px solid #ddd;
    padding: 7px;
    margin-top: -1px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      border: 1px solid #bbb;
      background: #fafafa;
    }
  }
`;

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
  const [favoriteRepos, setFavoriteRepos] = useState<
    { url: string; usePrivateRepo: boolean }[]
  >([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedFavoriteRepos = localStorage.getItem("favorite_repos");
    if (storedFavoriteRepos) {
      setFavoriteRepos(JSON.parse(storedFavoriteRepos));
    }

    const storedToken = localStorage.getItem("github_access_token");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const saveAccessToken = () => {
    localStorage.setItem("github_access_token", accessToken);
  };

  const loadRepo = async (repoURL: string, usePrivateRepo: boolean) => {
    setError("");
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

  const addFavoriteRepo = () => {
    const favoriteRepos = JSON.parse(
      localStorage.getItem("favorite_repos") || "[]"
    );

    const newRepo = {
      url: repoURL,
      usePrivateRepo,
    };
    if (!favoriteRepos.find((repo: any) => repo.url === newRepo.url)) {
      const newFavRepos = [...favoriteRepos, newRepo];
      setFavoriteRepos(newFavRepos);
      localStorage.setItem("favorite_repos", JSON.stringify(newFavRepos));
    }
  };

  const removeFavoriteRepo = (index: number) => {
    const updatedFavoriteRepos = favoriteRepos.filter((_, i) => i !== index);
    setFavoriteRepos(updatedFavoriteRepos);
    localStorage.setItem(
      "favorite_repos",
      JSON.stringify(updatedFavoriteRepos)
    );
  };

  const isRepoFavorited = () => {
    return favoriteRepos.some(
      (repo) => formatGithubURL(repo.url) === formatGithubURL(repoURL)
    );
  };

  return (
    <div style={{ marginTop: 40 }}>
      <StepHeading>Select Repo & Files</StepHeading>

      {error && (
        <div style={{ color: "red", marginTop: 10, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <FavoriteRepos>
        {favoriteRepos.map((repo: any, index: number) => (
          <div key={index}>
            <div
              onClick={() => {
                loadRepo(repo.url, repo.usePrivateRepo);
              }}
            >
              {formatGithubURL(repo.url)}
              <span style={{ marginLeft: 7, color: "#777" }}>
                {repo.usePrivateRepo ? "(private)" : "(public)"}
              </span>
            </div>
            <div>
              <CloseOutlined
                onClick={() => removeFavoriteRepo(index)}
                style={{ marginLeft: 5, cursor: "pointer" }}
              />
            </div>
          </div>
        ))}
      </FavoriteRepos>

      <Input.Search
        addonBefore="Github Repo URL:"
        placeholder="https://github.com/username/repo"
        allowClear
        onSearch={(value) => loadRepo(value, usePrivateRepo)}
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

      <Divider />

      {treeData.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <Tree
            checkable
            onCheck={(keys) => setCheckedKeys(keys as Key[])}
            checkedKeys={checkedKeys}
            treeData={treeData}
          />

          {!isRepoFavorited() && (
            <Button
              onClick={addFavoriteRepo}
              type="dashed"
              style={{ marginLeft: 25, marginTop: 10 }}
            >
              <StarOutlined /> Mark Repo as Favorite
            </Button>
          )}
        </div>
      )}
      {isLoading && (
        <div>
          <Spin
            style={{ marginTop: 15 }}
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        </div>
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
