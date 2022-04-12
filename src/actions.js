const core = require("@actions/core");
const { parseCommitMessage } = require("./main");
const { outputs } = require("./outputs");

async function run() {
  try {
    const result = await parseCommitMessage();

    for (const outputName of outputs) {
      console.log(outputName, result[outputName] || null);
      core.setOutput(outputName, result[outputName] || null);
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
