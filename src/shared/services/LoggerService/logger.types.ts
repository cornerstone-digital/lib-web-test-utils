export enum LogLevels {
  TRACE = 1,
  INFO = 2,
  DEBUG = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6
}

export interface ILoggerConfig {
  enabled: boolean
  level: LogLevels
}