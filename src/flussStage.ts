import FlussFlow from "./flussFlow";

class FlussStage {
    #ref: FlussStageRef;
    #data : FlussStageData;
    #mode: FlussStageMode = FlussStageMode.Idle;

    // ---------- // -  - // ---------- //

    #runningAction: FlussStageRunning | undefined;
    #completedAction: FlussStageCompleted | undefined;

    public constructor(ref : FlussStageRef, data : FlussStageData) {
        this.#data = data;

        this.#ref = Object.freeze(ref);
        this.#runningAction = data.onRunning;
        this.#completedAction = data.onCompleted;
    }

    // ------------------------- // -  - // ------------------------- //

    public get ref() : FlussStageRef {
        return this.#ref;
    }

    public get mode() : FlussStageMode {
        return this.#mode;
    }

    // ------------------------- // -  - // ------------------------- //

    public run() : boolean {
        if(!this.doRun()) {
            return false;
        }

        try {
            if(this.runningAction) {
                let result = typeof this.runningAction === "function" 
                    ? this.runningAction(this.ref.flow)
                    : this.runningAction;
            }
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
            if(this.runningAction) {
                let result = typeof this.runningAction === "function" 
                    ? await Promise.resolve(this.runningAction(this.ref.flow))
                    : await Promise.resolve(this.runningAction);
            }

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
            if(this.completedAction) {
                let result = typeof this.completedAction === "function" 
                    ? this.completedAction(this.ref.flow)
                    : this.completedAction;

                if(result) {
                    switch (result) {
                        case FlussStageCommand.Continue:
                            this.ref.flow.nextStage();
                            break;
                    }
                }
            }

            this.#mode = FlussStageMode.Pending;
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
            if(this.completedAction) {
                let result = typeof this.completedAction === "function" 
                    ? await Promise.resolve(this.completedAction(this.ref.flow))
                    : await Promise.resolve(this.completedAction);

                if(result) {
                    switch (result) {
                        case FlussStageCommand.Continue:
                            this.ref.flow.nextStage();
                            break;
                    }
                }
            }

            this.#mode = FlussStageMode.Pending;
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
        if (this.#mode !== FlussStageMode.Idle) {
            return false;
        }

        this.#mode = FlussStageMode.Running;
        return true;
    }

    protected doComplete() : boolean {
        if (this.#mode !== FlussStageMode.Pending) {
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
    Idle = 0,
    Running = 1,
    Pending = 2,
    Completed = 4
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageRef = {
    flow : FlussFlow;
    name : string;
}

// ------------------------------ // -  - // ------------------------------ //

export enum FlussStageResult {
    Success = 0,
    Failure = 1,
}

export enum FlussStageCommand {
    None = 0,
    Continue = 1,
}

export type FlussStageRunning = FlussStageRunningResult | FlussStageRunningAction;

export type FlussStageRunningResult = FlussStageResult;

export type FlussStageRunningAction = (flow : FlussFlow) => FlussStageRunningActionReturn | Promise<FlussStageRunningActionReturn>;

export type FlussStageRunningActionReturn = FlussStageResult | void;

export type FlussStageCompleted = FlussStageCompletedCommand | FlussStageCompletedAction;

export type FlussStageCompletedCommand = FlussStageCommand;

export type FlussStageCompletedAction = (flow : FlussFlow) => FlussStageCompletedActionReturn | Promise<FlussStageCompletedActionReturn>;

export type FlussStageCompletedActionReturn = FlussStageCommand | void;