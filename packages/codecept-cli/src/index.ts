#!/usr/bin/env node
import * as cli from 'commander'
import * as shell from 'shelljs'

cli
  .version('0.1.0', '-v, --version')
  .option('-t, --task <task>', 'E2E task to run')
  .option('-h, --hostname <regex>', 'Selects url to run tests against')
  .option('-p, --pattern <regex>', 'Runs only tests matching the pattern')
  .option('-u, --updateSnapshots', 'Updates snapshots')
  .option('-c, --config <path>', 'Allows you to pass a config file')
  .option('-s, --steps', 'Runs tests with steps printed')
  .option('-d, --debug', 'Run tests in debug mode')
  .option('-r, --reporter', 'Runs test with selected Mocha reporter')
  .option('-vb, --verbose', 'Runs in verbose mode')
  .parse(process.argv)

let shellCMDArray: string[] = ['codeceptjs run']

if (cli.config !== undefined) {
  shellCMDArray.push(`-c ${cli.config}`)
}

if (cli.pattern !== undefined) {
  shellCMDArray.push(`--grep ${cli.pattern}`)
}

if (cli.updateSnapshots !== undefined) {
  shellCMDArray.unshift('UPDATE_SNAPSHOTS=true')
}

if (cli.reporter !== undefined) {
  shellCMDArray.push(`--reporter ${cli.reporter}`)
}

if (cli.steps !== undefined) {
  shellCMDArray.push('--steps')
}

if (cli.debug !== undefined) {
  shellCMDArray.push('--debug')
}

if (cli.verbose !== undefined) {
  shellCMDArray.push('--verbose')
}

const shellCommand: string = shellCMDArray.join(' ')
shell.exec(shellCommand)
