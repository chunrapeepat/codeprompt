import GPT3Tokenizer from "gpt3-tokenizer";

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
export function countTokens(text: string): number {
  console.log("test/");
  return tokenizer.encode(text).bpe.length;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
}

export function formatGithubURL(url: string): string {
  // Split the URL into parts
  const parts = url.split("/");

  // Extract the owner and project name
  const owner = parts[3];
  const project = parts[4];

  // Combine the owner and project name and return the result
  return `${owner}/${project}`;
}

export function isImage(filename: string): boolean {
  return /\.(ico|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
}

export function isFolder(filename: string): boolean {
  return !/\.[^/.]+$/.test(filename);
}

export function base64Decode(str: string): string {
  return atob(str);
}

export function getMonacoLanguageFromFilename(filename: string): string {
  const fileExtension = filename.substr(filename.lastIndexOf("."));

  let monacoLanguage = "plaintext";

  switch (fileExtension) {
    case ".js":
    case ".jsx":
      monacoLanguage = "javascript";
      break;
    case ".ts":
    case ".tsx":
      monacoLanguage = "typescript";
      break;
    case ".html":
      monacoLanguage = "html";
      break;
    case ".css":
      monacoLanguage = "css";
      break;
    case ".json":
      monacoLanguage = "json";
      break;
    case ".xml":
      monacoLanguage = "xml";
      break;
    case ".sql":
      monacoLanguage = "sql";
      break;
    case ".md":
      monacoLanguage = "markdown";
      break;
    case ".py":
      monacoLanguage = "python";
      break;
    case ".java":
      monacoLanguage = "java";
      break;
    case ".c":
      monacoLanguage = "c";
      break;
    case ".cpp":
      monacoLanguage = "cpp";
      break;
    case ".cs":
      monacoLanguage = "csharp";
      break;
    case ".php":
      monacoLanguage = "php";
      break;
    case ".go":
      monacoLanguage = "go";
      break;
    case ".rb":
      monacoLanguage = "ruby";
      break;
    // Add more file extensions and languages as needed
    default:
      monacoLanguage = "plaintext";
  }

  return monacoLanguage;
}
