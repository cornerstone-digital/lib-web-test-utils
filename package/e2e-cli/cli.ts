import * as commander from 'commander'
import runCommand from './commands/run'

const cli = () => {
  commander
    .version('0.1.0', '-v, --version')

  commander
    .command('run')
    .description('Executes tests')

    // Codecept Specific Options
    .option('-s, --steps', 'Runs tests with steps printed')
    .option('-d, --debug', 'Run tests in debug mode')
    .option('-vb, --verbose', 'Runs in verbose mode')
    .option('-o, --override [value]', 'override current config options')
    .option('-c, --config [path]', 'Allows you to pass a config file')
    .option('--features', 'run only *.feature files and skip tests')
    .option('--tests', 'run only JS test files and skip features')
    .option('-r, --reporter [name]', 'Runs test with selected Mocha reporter')

    // Extended Options
    .option('-t, --task [task]', 'E2E task to run')
    .option('-h, --hostname [regex]', 'Selects url to run tests against')
    .option('-p, --pattern [regex]', 'Runs only tests matching the pattern')
    .option('-u, --updateSnapshots', 'Updates snapshots')
    .action(runCommand)

  return commander
}

export default cli
