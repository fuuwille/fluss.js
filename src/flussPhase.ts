enum FlussPhase {
    None = 0,
    Idle = 1 << 0,
    Begin = 1 << 1,
    PreBegin = 1 << 2 | Begin,
    PostBegin = 1 << 3 | Begin,
    Running = 1 << 4,
    PreRunning = 1 << 5 | Running,
    PostRunning = 1 << 6 | Running,
    End = 1 << 7,
    PreEnd = 1 << 8 | End,
    PostEnd = 1 << 9 | End,
    Completed = 1 << 10,
    PreCompleted = 1 << 11 | Completed,
    PostCompleted = 1 << 12 | Completed
}

export default FlussPhase;