import * as shell from 'shelljs'
import { ICLIOptions } from '@cli/types/cli.types'


export default (options: ICLIOptions) => {
  let shellCMDArray: string[] = ['codeceptjs run']

  if (options.config !== undefined) {
    shellCMDArray.push(`-c ${options.config}`)
  }

  if (options.pattern !== undefined) {
    shellCMDArray.push(`--grep ${options.pattern}`)
  }

  if (options.updateSnapshots !== undefined) {
    shellCMDArray.unshift(`UPDATE_SNAPSHOTS=${options.updateSnapshots}`)
  }

  if (options.reporter !== undefined) {
    shellCMDArray.push(`--reporter ${options.reporter}`)
  }

  if (options.steps !== undefined) {
    shellCMDArray.push('--steps')
  }

  if (options.debug !== undefined) {
    shellCMDArray.push('--debug')
  }

  if (options.verbose !== undefined) {
    shellCMDArray.push('--verbose')
  }

  const shellCommand: string = shellCMDArray.join(' ')
  shell.exec(shellCommand)
}
