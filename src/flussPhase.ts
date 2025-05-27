enum FlussPhase {
    None = 0,
    Idle = 1 << 0,
    PreIdle = (1 << 1) | Idle,
    PostIdle = (1 << 2) | Idle,
    Begin = 1 << 3,
    PreBegin = (1 << 4) | Begin,
    PostBegin = (1 << 5) | Begin,
    Running = 1 << 6,
    PreRunning = (1 << 7) | Running,
    PostRunning = (1 << 8) | Running,
    End = 1 << 9,
    PreEnd = (1 << 10) | End,
    PostEnd = (1 << 11) | End,
    Completed = 1 << 12,
    PreCompleted = (1 << 13) | Completed,
    PostCompleted = (1 << 14) | Completed,
    Cancelled = 1 << 15,
    PreCancelled = (1 << 16) | Cancelled,
    PostCancelled = (1 << 17) | Cancelled,
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussBasePhase = FlussPhase.Idle | FlussPhase.Begin | FlussPhase.Running | FlussPhase.End | FlussPhase.Completed | FlussPhase.Cancelled;

export type FlussPrePhase = FlussPhase.PreIdle | FlussPhase.PreBegin | FlussPhase.PreRunning | FlussPhase.PreEnd | FlussPhase.PreCompleted | FlussPhase.PreCancelled;

export type FlussPostPhase = FlussPhase.PostIdle | FlussPhase.PostBegin | FlussPhase.PostRunning | FlussPhase.PostEnd | FlussPhase.PostCompleted | FlussPhase.PostCancelled;