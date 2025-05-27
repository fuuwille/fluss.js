enum FlussMode {
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

export default FlussMode;

// ------------------------------ // -  - // ------------------------------ //

export type MainMode = FlussMode.Idle | FlussMode.Begin | FlussMode.Running | FlussMode.End | FlussMode.Completed | FlussMode.Cancelled;

export type PreMode = FlussMode.PreIdle | FlussMode.PreBegin | FlussMode.PreRunning | FlussMode.PreEnd | FlussMode.PreCompleted | FlussMode.PreCancelled;

export type PostMode = FlussMode.PostIdle | FlussMode.PostBegin | FlussMode.PostRunning | FlussMode.PostEnd | FlussMode.PostCompleted | FlussMode.PostCancelled;

// ------------------------------ // -  - // ------------------------------ //

export const modes = ['Idle', 'Begin', 'Running', 'End', 'Completed', 'Cancelled'] as const;

export const mainModes = modes.map(p => FlussMode[p]).reduce((a, b) => a | b, 0);

export const preModes = modes.map(p => FlussMode[`Pre${p}`]).reduce((a, b) => a | b, 0);

export const postModes = modes.map(p => FlussMode[`Post${p}`]).reduce((a, b) => a | b, 0);

// ------------------------------ // -  - // ------------------------------ //

export const isMainMode = (phase: FlussMode): phase is MainMode => {
    return (phase & mainModes) !== 0;
}

export const isPreMode = (phase: FlussMode): phase is PreMode => {
    return (phase & preModes) !== 0;
}

export const isPostMode = (phase: FlussMode): phase is PostMode => {
    return (phase & postModes) !== 0;
}

// ------------------------------ // -  - // ------------------------------ //

export const getPreMode = (phase: MainMode): PreMode => {
    const baseKey = FlussMode[phase] as keyof typeof FlussMode;
    const preKey = `Pre${baseKey}` as keyof typeof FlussMode;
    return FlussMode[preKey] as PreMode;}

export const getPostMode = (phase: MainMode): PostMode => {
    const baseKey = FlussMode[phase] as keyof typeof FlussMode;
    const postKey = `Post${baseKey}` as keyof typeof FlussMode;
    return FlussMode[postKey] as PostMode;
}

// ------------------------------ // -  - // ------------------------------ //

export type ModeVariant = 'Pre' | 'Post';

export const getModeVariant = <T extends ModeVariant>(
    phase: MainMode,
    variant: T
): T extends 'Pre' ? PreMode : PostMode => {
    const baseKey = FlussMode[phase] as keyof typeof FlussMode;
    const fullKey = `${variant}${baseKey}` as keyof typeof FlussMode;
    return FlussMode[fullKey] as any;
};