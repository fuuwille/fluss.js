import FlussStage, { FlussStageData } from "./flussStage";

class FlussFlow<TState extends FlussFlowState = FlussFlowState> {
    #state: TState;
    #data: FlussFlowData;

    // ---------- // -  - // ---------- //

    #stages : readonly FlussStage[];

    public constructor(state: TState, data: FlussFlowData) {
        this.#state = state;
        this.#data = data;

        const stages = Object.entries(data).map(([name, def]) => {
            return new FlussStage({ flow: this, name }, def);
        });

        this.#stages = Object.freeze(stages);
    }

    // ------------------------- // -  - // ------------------------- //

    public get state() : TState {
        return this.#state;
    }

    public get stages() : readonly FlussStage[] {
        return this.#stages;
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

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = <TState extends FlussFlowState>(state : TState, data: FlussFlowData) : FlussFlow<TState> => {
    return new FlussFlow<TState>(state, data);
}