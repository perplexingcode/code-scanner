const fs = require("fs");
const path = require("path");
const { directory } = require("./config");

function scanProject(projectPath) {
  // Use the imported constant here if needed
  console.log(directory);

  const folderTree = {};
  const projectName = path.basename(projectPath);
  folderTree[projectName] = {};

  scanDirectory(projectPath, folderTree[projectName]);

  return folderTree;
}

function scanDirectory(directoryPath, folderTree) {
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
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
