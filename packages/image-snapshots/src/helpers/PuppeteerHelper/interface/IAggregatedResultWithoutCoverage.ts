import ITestResult from "./ITestResult";
import ISnapshotSummary from "./ISnapshotSummary";

export default interface IAggregatedResultWithoutCoverage {
  numFailedTests: number;
  numFailedTestSuites: number;
  numPassedTests: number;
  numPassedTestSuites: number;
  numPendingTests: number;
  numPendingTestSuites: number;
  numRuntimeErrorTestSuites: number;
  numTotalTests: number;
  numTotalTestSuites: number;
  snapshot: ISnapshotSummary;
  startTime: number;
  success: boolean;
  testResults: Array<ITestResult>;
  wasInterrupted: boolean;
}