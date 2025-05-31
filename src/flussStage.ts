import FlussFlow from "./flussFlow";

class FlussStage {
    #ref: FlussStageRef;
    #data : FlussStageData;
    #mode: FlussStageMode = FlussStageMode.Idle;

    // ---------- // -  - // ---------- //

    #runningAction: FlussStageRunning | undefined;
    #finalizingAction: FlussStageFinalizing | undefined;

    public constructor(ref : FlussStageRef, data : FlussStageData) {
        this.#data = data;

        this.#ref = Object.freeze(ref);
        this.#runningAction = data.onRunning;
        this.#finalizingAction = data.onFinalizing;
    }

    // ------------------------- // -  - // ------------------------- //

    public get ref() : FlussStageRef {
        return this.#ref;
    }

    public get mode() : FlussStageMode {
        return this.#mode;
    }

    // ------------------------- // -  - // ------------------------- //

    public async runAsync() : Promise<boolean> {
        if(!this.doRun()) {
            return false;
        }

        try {
            let result : FlussStageResult | void = undefined;

            if(this.runningAction) {
                result = typeof this.runningAction === "function" 
                    ? await Promise.resolve(this.runningAction(this.ref.flow))
                    : await Promise.resolve(this.runningAction);
            }

            this.#mode = FlussStageMode.Pending;

            if(result) {
                if((result & FlussStageResult.Continue) === FlussStageResult.Continue) {
                    await this.finalizeAsync();
                }
            }
            
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public async finalizeAsync() : Promise<boolean> {
        if(!this.doFinalize()) {
            return false;
        }

        try {
            let result : FlussStageResult | void = undefined;

            if(this.runningAction) {
                result = typeof this.finalizingAction === "function" 
                    ? await Promise.resolve(this.finalizingAction(this.ref.flow))
                    : await Promise.resolve(this.finalizingAction);
            }

            this.#mode = FlussStageMode.Completed;

            if(result) {
                if((result & FlussStageResult.Continue) === FlussStageResult.Continue) {
                    await Promise.resolve(this.ref.flow.nextStage()?.runAsync());
                }
            }

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

    protected get finalizingAction() : FlussStageFinalizing | undefined {
        return this.#finalizingAction;
    }

    // ------------------------- // -  - // ------------------------- //

    protected doRun() : boolean {
        if (this.#mode !== FlussStageMode.Idle) {
            return false;
        }

        this.#mode = FlussStageMode.Executing;
        return true;
    }

    protected doFinalize() : boolean {
        if (this.#mode !== FlussStageMode.Pending) {
            return false;
        }

        this.#mode = FlussStageMode.Finalizing;
        return true;
    }
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageRef = {
    flow : FlussFlow;
    name : string;
}

export type FlussStageDef = {
    src : FlussStageData;
};

export type FlussStageData = {
    onRunning?: FlussStageRunning;
    onFinalizing?: FlussStageFinalizing;
}

export enum FlussStageMode {
    Idle,
    Executing,
    Pending,
    Finalizing,
    Completed,
}

// ------------------------------ // -  - // ------------------------------ //

export enum FlussStageResult {
    Success = 1,
    Failure = 2,
    Continue = 4,
}

export type FlussStageReturn<T> = T | void;

export type FlussStageRunning = FlussStageResult | FlussStageRunningAction;

export type FlussStageRunningAction = (flow : FlussFlow) => FlussStageReturn<FlussStageResult> | Promise<FlussStageReturn<FlussStageResult>>;

export type FlussStageFinalizing = FlussStageResult | FlussStageFinalizingAction;

export type FlussStageFinalizingAction = (flow : FlussFlow) => FlussStageReturn<FlussStageResult> | Promise<FlussStageReturn<FlussStageResult>>;
