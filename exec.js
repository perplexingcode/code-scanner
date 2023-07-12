const fs = require("fs");
const path = require("path");
const { directory, ignoreList, extractList, projectName } = require("./config");

function scanProject(projectPath) {
  const folderTree = {};
  const projectName = path.basename(projectPath);
  folderTree[projectName] = {};

  scanDirectory(projectPath, folderTree[projectName]);

  return folderTree;
}

function shouldIgnore(item) {
  return ignoreList.includes(item);
}

function shouldExtract(item) {
  return extractList.some((extension) => item.endsWith(extension));
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
    } else if (shouldExtract(item)) {
      const content = fs.readFileSync(itemPath, "utf8");
      folderTree[item] = content;
    }
  });
}

function writeFolderTreeToFile(folderTree, projectName) {
  const filePath = path.join(
    __dirname,
    `./output/${
      projectName || directory.replace(":", "-").replaceAll("/", "-")
    }.txt`,
  );
  const treeString = JSON.stringify(folderTree, null, 2);
  fs.writeFileSync(filePath, treeString);
  console.log(
    `Folder tree has been written to ${projectName}.txt successfully.`,
  );
}

// Example usage
const projectPath = directory;
const folderTree = scanProject(projectPath);
writeFolderTreeToFile(folderTree, projectName);
