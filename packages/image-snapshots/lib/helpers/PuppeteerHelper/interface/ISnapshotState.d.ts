import ISnapshotSummary from "./ISnapshotSummary";
export default interface ISnapshotState {
    counters: Map<string, number>;
    dirty: boolean;
    snapshotData: Map<string, ISnapshotSummary>;
    added: number;
    matched: number;
    unmatched: number;
    updated: number;
    deleted: number;
    total: number;
    updateSnapshots: boolean;
}
