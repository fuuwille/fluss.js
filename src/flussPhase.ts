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

export type FlussMainPhase = FlussPhase.Idle | FlussPhase.Begin | FlussPhase.Running | FlussPhase.End | FlussPhase.Completed | FlussPhase.Cancelled;

export type FlussPrePhase = FlussPhase.PreIdle | FlussPhase.PreBegin | FlussPhase.PreRunning | FlussPhase.PreEnd | FlussPhase.PreCompleted | FlussPhase.PreCancelled;

export type FlussPostPhase = FlussPhase.PostIdle | FlussPhase.PostBegin | FlussPhase.PostRunning | FlussPhase.PostEnd | FlussPhase.PostCompleted | FlussPhase.PostCancelled;

// ------------------------------ // -  - // ------------------------------ //

export const phases = ['Idle', 'Begin', 'Running', 'End', 'Completed', 'Cancelled'] as const;

export const flussMainPhases = phases.map(p => FlussPhase[p]).reduce((a, b) => a | b, 0);

export const flussPrePhases = phases.map(p => FlussPhase[`Pre${p}`]).reduce((a, b) => a | b, 0);

export const flussPostPhases = phases.map(p => FlussPhase[`Post${p}`]).reduce((a, b) => a | b, 0);

// ------------------------------ // -  - // ------------------------------ //

export const isMainPhase = (phase: FlussPhase): phase is FlussMainPhase => {
    return (phase & flussMainPhases) !== 0;
}

export const isPrePhase = (phase: FlussPhase): phase is FlussPrePhase => {
    return (phase & flussPrePhases) !== 0;
}

export const isPostPhase = (phase: FlussPhase): phase is FlussPostPhase => {
    return (phase & flussPostPhases) !== 0;
}

// ------------------------------ // -  - // ------------------------------ //

export const getPrePhase = (phase: FlussMainPhase): FlussPrePhase => {
    const baseKey = FlussPhase[phase] as keyof typeof FlussPhase;
    const preKey = `Pre${baseKey}` as keyof typeof FlussPhase;
    return FlussPhase[preKey] as FlussPrePhase;}

export const getPostPhase = (phase: FlussMainPhase): FlussPostPhase => {
    const baseKey = FlussPhase[phase] as keyof typeof FlussPhase;
    const postKey = `Post${baseKey}` as keyof typeof FlussPhase;
    return FlussPhase[postKey] as FlussPostPhase;
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseVariant = 'Pre' | 'Post';

export const getPhaseVariant = <T extends FlussPhaseVariant>(
    phase: FlussMainPhase,
    variant: T
): T extends 'Pre' ? FlussPrePhase : FlussPostPhase => {
    const baseKey = FlussPhase[phase] as keyof typeof FlussPhase;
    const fullKey = `${variant}${baseKey}` as keyof typeof FlussPhase;
    return FlussPhase[fullKey] as any;
};