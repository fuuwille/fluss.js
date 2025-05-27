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

// ------------------------------ // -  - // ------------------------------ //

export const phases = ['Idle', 'Begin', 'Running', 'End', 'Completed', 'Cancelled'] as const;

export const flussBasePhases = phases.map(p => FlussPhase[p]).reduce((a, b) => a | b, 0);

export const flussPrePhases = phases.map(p => FlussPhase[`Pre${p}`]).reduce((a, b) => a | b, 0);

export const flussPostPhases = phases.map(p => FlussPhase[`Post${p}`]).reduce((a, b) => a | b, 0);

// ------------------------------ // -  - // ------------------------------ //

export const isBasePhase = (phase: FlussPhase): phase is FlussBasePhase => {
    return (phase & FlussPhase.Idle) === FlussPhase.Idle ||
           (phase & FlussPhase.Begin) === FlussPhase.Begin ||
           (phase & FlussPhase.Running) === FlussPhase.Running ||
           (phase & FlussPhase.End) === FlussPhase.End ||
           (phase & FlussPhase.Completed) === FlussPhase.Completed ||
           (phase & FlussPhase.Cancelled) === FlussPhase.Cancelled;
}

export const isPrePhase = (phase: FlussPhase): phase is FlussPrePhase => {
    return (phase & FlussPhase.PreIdle) === FlussPhase.PreIdle ||
           (phase & FlussPhase.PreBegin) === FlussPhase.PreBegin ||
           (phase & FlussPhase.PreRunning) === FlussPhase.PreRunning ||
           (phase & FlussPhase.PreEnd) === FlussPhase.PreEnd ||
           (phase & FlussPhase.PreCompleted) === FlussPhase.PreCompleted ||
           (phase & FlussPhase.PreCancelled) === FlussPhase.PreCancelled;
}

export const isPostPhase = (phase: FlussPhase): phase is FlussPostPhase => {
    return (phase & FlussPhase.PostIdle) === FlussPhase.PostIdle ||
           (phase & FlussPhase.PostBegin) === FlussPhase.PostBegin ||
           (phase & FlussPhase.PostRunning) === FlussPhase.PostRunning ||
           (phase & FlussPhase.PostEnd) === FlussPhase.PostEnd ||
           (phase & FlussPhase.PostCompleted) === FlussPhase.PostCompleted ||
           (phase & FlussPhase.PostCancelled) === FlussPhase.PostCancelled;
}

export const getPrePhase = (phase: FlussBasePhase): FlussPrePhase => {
    switch (phase) {
        case FlussPhase.Idle: return FlussPhase.PreIdle;
        case FlussPhase.Begin: return FlussPhase.PreBegin;
        case FlussPhase.Running: return FlussPhase.PreRunning;
        case FlussPhase.End: return FlussPhase.PreEnd;
        case FlussPhase.Completed: return FlussPhase.PreCompleted;
        case FlussPhase.Cancelled: return FlussPhase.PreCancelled;
        default: throw new Error(`Invalid phase for pre-phase conversion: ${phase}`);
    }
}

export const getPostPhase = (phase: FlussBasePhase): FlussPostPhase => {
    switch (phase) {
        case FlussPhase.Idle: return FlussPhase.PostIdle;
        case FlussPhase.Begin: return FlussPhase.PostBegin;
        case FlussPhase.Running: return FlussPhase.PostRunning;
        case FlussPhase.End: return FlussPhase.PostEnd;
        case FlussPhase.Completed: return FlussPhase.PostCompleted;
        case FlussPhase.Cancelled: return FlussPhase.PostCancelled;
        default: throw new Error(`Invalid phase for post-phase conversion: ${phase}`);
    }
}