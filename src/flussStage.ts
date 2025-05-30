class FlussStage {
    #mode: FlussStageMode = FlussStageMode.Pending;

    public constructor() {

    }

    // ------------------------- // -  - // ------------------------- //

    public get mode() : FlussStageMode {
        return this.#mode;
    }
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export enum FlussStageMode {
    Pending = 0,
    Running = 1,
    Completed = 2
}