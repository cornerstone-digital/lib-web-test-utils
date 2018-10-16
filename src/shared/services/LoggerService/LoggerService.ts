import debug, { IDebugger } from 'debug'
import { ILoggerConfig, LogLevels } from './logger.types'

class LoggerService {
  private instance: IDebugger
  private level: LogLevels
  private enabled: boolean

  constructor (namespace: string, config: ILoggerConfig) {
    this.instance = debug(namespace)
    this.level = config.level
    this.enabled = config.enabled

    return this
  }

  public trace (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.TRACE) {
      this.instance(args)
    }
  }

  public info (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.INFO) {
      this.instance(args)
    }
  }

  public debug (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.DEBUG) {
      this.instance(args)
    }
  }

  public warn (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.WARN) {
      this.instance(args)
    }
  }

  public error (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.ERROR) {
      this.instance(args)
    }
  }

  public fatal (...args: any[]) {
    if (this.enabled && this.level >= LogLevels.FATAL) {
      this.instance(args)
    }
  }
}

export default LoggerService
