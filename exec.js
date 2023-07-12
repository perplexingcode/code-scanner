const fs = require("fs");
const path = require("path");
const { directory, ignoreList } = require("./config");

function scanProject(projectPath) {
  // Use the imported constant here if needed
  console.log(directory);

  const folderTree = {};
  const projectName = path.basename(projectPath);
  folderTree[projectName] = {};

  scanDirectory(projectPath, folderTree[projectName]);

  return folderTree;
}

function shouldIgnore(item) {
  return ignoreList.includes(item);
}

function scanDirectory(directoryPath, folderTree) {
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    if (shouldIgnore(item)) {
      return;
    }

    const itemPath = path.join(directoryPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    if (isDirectory) {
      folderTree[item] = {};
      scanDirectory(itemPath, folderTree[item]);
    }
  });
}

// Example usage
const projectPath = directory;
const folderTree = scanProject(projectPath);
console.log(JSON.stringify(folderTree, null, 2));
