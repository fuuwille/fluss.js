import { FlussCommand, FlussResult, FlussReturn } from "./fluss";
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
            return Promise.resolve(false);
        }

        let result : FlussResult | void = undefined;
        let command : FlussCommand | void = undefined;

        try {
            this.#mode = FlussStageMode.Running;

            if(this.runningAction) {
                result = typeof this.runningAction === "function" 
                    ? await Promise.resolve(this.runningAction(this.ref.flow))
                    : await Promise.resolve(this.runningAction);
            }

            this.#mode = FlussStageMode.Finalizing;

            if(this.finalizingAction) {
                command = typeof this.finalizingAction === "function" 
                    ? await Promise.resolve(this.finalizingAction(this.ref.flow))
                    : await Promise.resolve(this.finalizingAction);
            }

            this.#mode = FlussStageMode.Completed;

            switch(command) {
                case FlussCommand.Continue:
                    await this.ref.flow.continueAsync();
                    break;
                case FlussCommand.Abort:
                    this.ref.flow.abort();
                    break;
            }
        }
        catch (error) {

        }

        return true;
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

export type FlussStageRunning = FlussResult | FlussStageRunningAction;

export type FlussStageRunningAction = (flow : FlussFlow) => FlussReturn<FlussResult> | Promise<FlussReturn<FlussResult>>;

export type FlussStageFinalizing = FlussCommand | FlussStageFinalizingAction;

export type FlussStageFinalizingAction = (flow : FlussFlow) => FlussReturn<FlussCommand> | Promise<FlussReturn<FlussCommand>>;