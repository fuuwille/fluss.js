enum FlussPhase {
    None = 0,
    Idle = 1 << 0,
    Begin = 1 << 1,
    PreBegin = 1 << 2 | Begin,
    PostBegin = 1 << 3 | Begin,
    Running = 1 << 4,
    PreRunning = 1 << 5 | Running,
    PostRunning = 1 << 6 | Running
}

export default FlussPhase;