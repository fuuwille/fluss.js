enum FlussPhase {
    None = 0,
    Idle = 1 << 0,
    Start = 1 << 1,
    StartBefore = 1 << 2 | Start,
    StartAfter = 1 << 3 | Start
}

export default FlussPhase;