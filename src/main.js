const semver = require("semver");
const simpleGit = require("simple-git/promise");
const { outputs } = require("./outputs");

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
  const result = {};
  for (const outputName of outputs) {
    result[outputName] = null;
  }
  const log = await git.log()
  const latestMessage = log.latest.message
  const parsed = semver.parse(latestMessage)
  if (!parsed) {
    result.valid = false
  } else {
    Object.assign(result, parsed)
    if (parsed.build.length > 0) {
      result.build_number = parseInt(parsed.build[0], 10)
    }
    if (parsed.prerelease.length > 0) {
      result.is_prerelease = true
      result.prerelease_name = parsed.prerelease[0]
      result.prerelease_number = parsed.prerelease[1]
    }
  }


  return result;
}

module.exports = {
  parseCommitMessage,
};
