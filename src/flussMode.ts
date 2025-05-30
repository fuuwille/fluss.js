enum FlussMode {
    None = 0,
    Pending = 1 << 0,
    Begin = 1 << 1,
    Running = 1 << 2,
    End = 1 << 3,
    Completed = 1 << 4,
    Cancelled = 1 << 5,
    Failed = 1 << 6,
    TimedOut = 1 << 7,
}

export default FlussMode;

// ------------------------------ // -  - // ------------------------------ //

export enum FlussCycleMode {
    None = 0,
    Pre = 1 << 0,
    Main = 1 << 1,
    Post = 1 << 2,
}