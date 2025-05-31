import FlussFlow from "./flussFlow";

class FlussStage {
    #data : FlussStageData;
    #mode: FlussStageMode = FlussStageMode.Pending;

    // ---------- // -  - // ---------- //

    #runningAction: FlussStageRunning | undefined;
    #completedAction: FlussStageCompleted | undefined;

    public constructor(data : FlussStageData) {
        this.#data = data;

        this.#runningAction = data.onRunning;
        this.#completedAction = data.onCompleted;
    }

    // ------------------------- // -  - // ------------------------- //

    public get mode() : FlussStageMode {
        return this.#mode;
    }

    // ------------------------- // -  - // ------------------------- //

    public run() : boolean {
        if(!this.doRun()) {
            return false;
        }

        try {
            this.runningAction?.();
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public async runAsync() : Promise<boolean> {
        if(!this.doRun()) {
            return false;
        }

        try {
            await Promise.resolve(this.runningAction?.());
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public complete() : boolean {
        if(!this.doComplete()) {
            return false;
        }

        try {
            this.completedAction?.();
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public async completeAsync() : Promise<boolean> {
        if(!this.doComplete()) {
            return false;
        }

        try {
            await Promise.resolve(this.completedAction?.());
            return true;
        }
        catch (error) {
            return false;
        }
    }

    // ------------------------- // -  - // ------------------------- //

    protected get runningAction() : FlussStageRunning | undefined {
        return this.#runningAction;
    }

    protected get completedAction() : FlussStageCompleted | undefined {
        return this.#completedAction;
    }

    // ------------------------- // -  - // ------------------------- //

    protected doRun() : boolean {
        if (this.#mode !== FlussStageMode.Pending) {
            return false;
        }

        this.#mode = FlussStageMode.Running;
        return true;
    }

    protected doComplete() : boolean {
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

export type FlussStageRef = {
    flow : FlussFlow;
    name : string;
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