require("dotenv").config();

const fs = require("fs");
const path = require("path");

let { PROJECT_DIR, IGNORE_LIST, EXTRACT_LIST, PROJECT_NAME } = process.env;
EXTRACT_LIST = EXTRACT_LIST.split(",");
IGNORE_LIST = IGNORE_LIST.split(",");

function scanProject(projectPath) {
  const folderTree = {};

  scanDirectory(projectPath, folderTree, "");

  return folderTree;
}

function shouldIgnore(item) {
  return IGNORE_LIST.includes(item);
}

function shouldExtract(item) {
  return EXTRACT_LIST.some((extension) => item.endsWith(extension));
}

function scanDirectory(directoryPath, folderTree, currentPath) {
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    if (shouldIgnore(item)) {
      return;
    }

    const itemPath = path.join(directoryPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    const newPath = currentPath === "" ? item : `${currentPath}/${item}`;

    if (isDirectory) {
      scanDirectory(itemPath, folderTree, newPath);
    } else if (shouldExtract(item)) {
      const content = fs
        .readFileSync(itemPath, "utf8")
        .replaceAll("\n", " ")
        .replace(/"/g, "'");
      folderTree[newPath] = content;
    }
  });
}

function countWords(text) {
  const words = text.trim().split(/\s+/);
  return words.length;
}

function writeFolderTreeToFile(folderTree, projectName) {
  const filePath = path.join(
    __dirname,
    `./output/${
      projectName || PROJECT_DIR.replace(":", "-").replaceAll("/", "-")
    }.json`,
  );
  const treeString = JSON.stringify(folderTree, null, 2);
  fs.writeFileSync(filePath, treeString.replace(/\\/g, ""));

  const wordCount = countWords(treeString);
  if (wordCount > 25000) {
    console.warn(
      `Warning: The word count (${wordCount}) exceeds 25,000 words. Please add more files or folders to the ignore list in config.js.`,
    );
  }

  console.log(
    `Folder content has been written to ${projectName}.json successfully.\nWord count: ${wordCount} words.`,
  );
}

// Example usage
const folderTree = scanProject(PROJECT_DIR);
writeFolderTreeToFile(folderTree, PROJECT_NAME);
