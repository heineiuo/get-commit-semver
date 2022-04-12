const semver = require("semver");
const simpleGit = require("simple-git/promise");
const outputs = require("./outputs");

async function getCommitsBetweenTags(git, prevTag, nextTag) {
  const results = await git.log({ from: prevTag, to: nextTag });
  const { all } = results;

  const messages = [];
  for (const line of all) {
    if (line.refs.indexOf("tag") > -1) continue;
    messages.push(`* ${line.message}`);
  }

  return messages.sort();
}

async function parseCommitMessage() {
  const git = simpleGit(process.cwd());

  const latestLog = git.log({ maxCount: 1 });
  console.log(latestLog);
  const result = {};
  for (const outputName of outputs) {
    result[outputName] = null;
  }

  return result;
}

module.exports = {
  parseCommitMessage,
};
