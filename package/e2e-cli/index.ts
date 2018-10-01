import cli from './cli'
import { CommanderStatic } from 'commander';

const cliInstance: CommanderStatic = cli()

cliInstance.parse(process.argv)

module.exports = cliInstance
