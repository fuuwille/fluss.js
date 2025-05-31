import { FlussStageData } from "./flussStage";

class FlussFlow<TState extends FlussFlowState = FlussFlowState> {
    #state: TState;
    #data: FlussFlowData;

    public constructor(state: TState, data: FlussFlowData) {
        this.#state = state;
        this.#data = data;
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