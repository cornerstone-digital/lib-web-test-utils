import ISnapshotState from "./ISnapshotState";
export default interface ITestResult {
    displayName: string;
    failing: number;
    passing: number;
    snapshots: ISnapshotState;
}
