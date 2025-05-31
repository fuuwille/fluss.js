import { FlussCommand, FlussResult, FlussReturn } from "./fluss";
import FlussFlow from "./flussFlow";

class FlussStage {
    #ref: FlussStageRef;
    #data : FlussStageData;
    #mode: FlussStageMode = FlussStageMode.Idle;

    // ---------- // -  - // ---------- //

    #onRunning: FlussStagePreparing | undefined;
    #onFinalizing: FlussStageFinalizing | undefined;

    public constructor(ref : FlussStageRef, data : FlussStageData) {
        this.#data = data;

        this.#ref = Object.freeze(ref);
        this.#onRunning = data.onPreparing;
        this.#onFinalizing = data.onFinalizing;
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
            this.#mode = FlussStageMode.Preparing;

            if(this.onPreparing) {
                const promise = typeof this.onPreparing === "function" 
                    ? this.onPreparing(this.ref.flow)
                    : Promise.resolve(this.onPreparing);

                result = await promise;
            }

            this.#mode = FlussStageMode.Finalizing;

            if(this.onFinalizing) {
                const promise = typeof this.onFinalizing === "function" 
                    ? this.onFinalizing(this.ref.flow)
                    : Promise.resolve(this.onFinalizing);

                command = await promise;
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

    protected get onPreparing() : FlussStagePreparing | undefined {
        return this.#onRunning;
    }

    protected get onFinalizing() : FlussStageFinalizing | undefined {
        return this.#onFinalizing;
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
    onPreparing?: FlussStagePreparing;
    onFinalizing?: FlussStageFinalizing;
}

export enum FlussStageMode {
    Idle,
    Preparing,
    Finalizing,
    Completed,
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussStagePreparing = FlussResult | FlussStagePreparingAction;

export type FlussStagePreparingAction = (flow : FlussFlow) => FlussReturn<FlussResult> | Promise<FlussReturn<FlussResult>>;

export type FlussStageFinalizing = FlussCommand | FlussStageFinalizingAction;

export type FlussStageFinalizingAction = (flow : FlussFlow) => FlussReturn<FlussCommand> | Promise<FlussReturn<FlussCommand>>;