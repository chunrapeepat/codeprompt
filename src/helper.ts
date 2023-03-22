export function formatGithubURL(url: string): string {
  // Split the URL into parts
  const parts = url.split("/");

  // Extract the owner and project name
  const owner = parts[3];
  const project = parts[4];

  // Combine the owner and project name and return the result
  return `${owner}/${project}`;
}
