const core = require("@actions/core");
const { parseCommitMessage } = require("./main");
const { outputs } = require("./outputs");

async function run() {
  try {
    const result = await parseCommitMessage();

    for (const outputName of outputs) {
      core.setOutput(outputName, result[outputName] || null);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
