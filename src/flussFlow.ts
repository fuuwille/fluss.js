import { FlussStageData } from "./flussStage";

class FlussFlow<TState extends FlussFlowState = FlussFlowState> {
    #state: TState;

    public constructor(state: TState) {
        this.#state = state;
    }

    // ------------------------- // -  - // ------------------------- //

    public get state() : TState {
        return this.#state;
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData = {
    [key: string]: FlussStageData;
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowState = {
    [key : string] : any;
}