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
    onRunning?: () => void;
    onCompleted?: () => void;
}

export enum FlussStageMode {
    Pending = 0,
    Running = 1,
    Completed = 2
}