enum FlussPhaseType {
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

export default FlussPhaseType;

// ------------------------------ // -  - // ------------------------------ //

export type MainPhaseType = FlussPhaseType.Idle | FlussPhaseType.Begin | FlussPhaseType.Running | FlussPhaseType.End | FlussPhaseType.Completed | FlussPhaseType.Cancelled;

export type PrePhaseType = FlussPhaseType.PreIdle | FlussPhaseType.PreBegin | FlussPhaseType.PreRunning | FlussPhaseType.PreEnd | FlussPhaseType.PreCompleted | FlussPhaseType.PreCancelled;

export type PostPhaseType = FlussPhaseType.PostIdle | FlussPhaseType.PostBegin | FlussPhaseType.PostRunning | FlussPhaseType.PostEnd | FlussPhaseType.PostCompleted | FlussPhaseType.PostCancelled;

// ------------------------------ // -  - // ------------------------------ //

export const phases = ['Idle', 'Begin', 'Running', 'End', 'Completed', 'Cancelled'] as const;

export const mainPhaseTypes = phases.map(p => FlussPhaseType[p]).reduce((a, b) => a | b, 0);

export const prePhaseTypes = phases.map(p => FlussPhaseType[`Pre${p}`]).reduce((a, b) => a | b, 0);

export const postPhaseTypes = phases.map(p => FlussPhaseType[`Post${p}`]).reduce((a, b) => a | b, 0);

// ------------------------------ // -  - // ------------------------------ //

export const isMainPhase = (phase: FlussPhaseType): phase is MainPhaseType => {
    return (phase & mainPhaseTypes) !== 0;
}

export const isPrePhase = (phase: FlussPhaseType): phase is PrePhaseType => {
    return (phase & prePhaseTypes) !== 0;
}

export const isPostPhase = (phase: FlussPhaseType): phase is PostPhaseType => {
    return (phase & postPhaseTypes) !== 0;
}

// ------------------------------ // -  - // ------------------------------ //

export const getPrePhase = (phase: MainPhaseType): PrePhaseType => {
    const baseKey = FlussPhaseType[phase] as keyof typeof FlussPhaseType;
    const preKey = `Pre${baseKey}` as keyof typeof FlussPhaseType;
    return FlussPhaseType[preKey] as PrePhaseType;}

export const getPostPhase = (phase: MainPhaseType): PostPhaseType => {
    const baseKey = FlussPhaseType[phase] as keyof typeof FlussPhaseType;
    const postKey = `Post${baseKey}` as keyof typeof FlussPhaseType;
    return FlussPhaseType[postKey] as PostPhaseType;
}

// ------------------------------ // -  - // ------------------------------ //

export type PhaseTypeVariant = 'Pre' | 'Post';

export const getPhaseVariant = <T extends PhaseTypeVariant>(
    phase: MainPhaseType,
    variant: T
): T extends 'Pre' ? PrePhaseType : PostPhaseType => {
    const baseKey = FlussPhaseType[phase] as keyof typeof FlussPhaseType;
    const fullKey = `${variant}${baseKey}` as keyof typeof FlussPhaseType;
    return FlussPhaseType[fullKey] as any;
};