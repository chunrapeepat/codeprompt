export function formatGithubURL(url: string): string {
  // Split the URL into parts
  const parts = url.split("/");

  // Extract the owner and project name
  const owner = parts[3];
  const project = parts[4];

  // Combine the owner and project name and return the result
  return `${owner}/${project}`;
}

// check if the filename is a image
export function isImage(filename: string): boolean {
  return /\.(ico|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
}

// check if the filename is a folder
export function isFolder(filename: string): boolean {
  return !/\.[^/.]+$/.test(filename);
}

// base64 decode
export function base64Decode(str: string): string {
  return atob(str);
}
