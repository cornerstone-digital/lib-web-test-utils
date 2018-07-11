import ITestResult from "./ITestResult";
export default interface ISnapshotSummary {
    suite: any;
    test: any;
    results: Array<ITestResult>;
}
