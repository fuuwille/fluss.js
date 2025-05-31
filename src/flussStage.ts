class FlussStage {
    #data : FlussStageData;
    #mode: FlussStageMode = FlussStageMode.Pending;

    public constructor(data : FlussStageData) {
        this.#data = data;
    }

    // ------------------------- // -  - // ------------------------- //

    public get mode() : FlussStageMode {
        return this.#mode;
    }

    // ------------------------- // -  - // ------------------------- //

    public run() : boolean {
        if (this.#mode !== FlussStageMode.Pending) {
            return false;
        }

        this.#mode = FlussStageMode.Running;
        return true;
    }

    public complete() : boolean {
        if (this.#mode !== FlussStageMode.Running) {
            return false;
        }

        this.#mode = FlussStageMode.Completed;
        return true;
    }
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageData = {
    onRunning?: FlussStageRunning;
    onCompleted?: FlussStageCompleted;
}

export enum FlussStageMode {
    Pending = 0,
    Running = 1,
    Completed = 2
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageRunning = () => FlussStageResult | Promise<FlussStageResult>;

export type FlussStageCompleted = () => FlussStageCommand | Promise<FlussStageCommand>;

export enum FlussStageResult {
    Success = 0,
    Failure = 1,
}

export enum FlussStageCommand {
    None = 0,
    Continue = 1,
}