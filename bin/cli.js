const argv = require('yargs').argv
const main = require('../src/main')

async function cli() {
  console.log(await main.parseCommitMessage())
}

cli()