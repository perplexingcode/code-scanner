// config.js
const directory = "C:/div/perplexingcode/~trinity/management-fe";
const ignoreList = [
  "node_modules",
  "dist",
  "dev",
  ".git",
  ".nuxt",
  ".output",
  "archive",
  "package-lock.json",
];
const extractList = [
  ".vue",
  ".css",
  ".js",
  ".ts",
  ".json",
  ".env",
  ".txt",
  ".md",
];

const projectName = "TRC-Management-frontend";

module.exports = {
  directory,
  ignoreList,
  extractList,
  projectName,
};
