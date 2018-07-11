interface ICodeceptTest {
  title: string
  body: string
  async: boolean
  sync: boolean
  timedOut: false
  pending: false
  type: string
  file: string
  inject: object
  steps: [object]
  parent: string
  ctx: string
  opts: object,
  retryNum: number
}

interface ISnapshotConfig {
  snapshotsDir: string
}

interface ISnapshotState {
  counters: Map<string, number>
  dirty: boolean
  snapshotData: Map<string, ISnapshotSummary>
  added: number
  matched: number
  unmatched: number
  updated: number
  deleted: number
  total: number
  updateSnapshots: boolean
}

interface ISnapshotSummary {
  suite: any
  test: any
  results: Array<ITestResult>
}

interface ITestResult {
  displayName: string
  failing: number
  passing: number
  snapshots: ISnapshotState
}

interface IUncheckedSnapshot {
  filePath: string
  keys: Array<string>
}

interface IAggregatedResultWithoutCoverage {
  numFailedTests: number
  numFailedTestSuites: number
  numPassedTests: number
  numPassedTestSuites: number
  numPendingTests: number
  numPendingTestSuites: number
  numRuntimeErrorTestSuites: number
  numTotalTests: number
  numTotalTestSuites: number
  snapshot: ISnapshotSummary
  startTime: number
  success: boolean
  testResults: Array<ITestResult>
  wasInterrupted: boolean
}

interface ISnapshotResult {
  pass?: boolean
  added?: boolean
  updated?: boolean,
  diffOutputPath?: string
  diffRatio?: number
  diffPixelCount?: number
}
