import { FlussResult } from "./fluss";
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

    public async executeAsync() : Promise<boolean> {
        if(this.#mode != FlussStageMode.Idle) {
            return false;
        }

        try {
            let result : FlussResult | void = undefined;

            if(this.runningAction) {
                result = typeof this.runningAction === "function" 
                    ? await Promise.resolve(this.runningAction(this.ref.flow))
                    : await Promise.resolve(this.runningAction);
            }

            this.#mode = FlussStageMode.Finalizing;

            let command : FlussResult | void = undefined;

            if(this.finalizingAction) {
                command = typeof this.finalizingAction === "function" 
                    ? await Promise.resolve(this.finalizingAction(this.ref.flow))
                    : await Promise.resolve(this.finalizingAction);
            }

            this.#mode = FlussStageMode.Completed;

            if(command) {
                await this.ref.flow.nextStage()?.executeAsync();
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
    Running,
    Finalizing,
    Completed,
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageReturn<T> = T | void;

export type FlussStageRunning = FlussResult | FlussStageRunningAction;

export type FlussStageRunningAction = (flow : FlussFlow) => FlussStageReturn<FlussResult> | Promise<FlussStageReturn<FlussResult>>;

export type FlussStageFinalizing = FlussResult | FlussStageFinalizingAction;

export type FlussStageFinalizingAction = (flow : FlussFlow) => FlussStageReturn<FlussResult> | Promise<FlussStageReturn<FlussResult>>;
