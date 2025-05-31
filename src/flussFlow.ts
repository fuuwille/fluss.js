import FlussStage, { FlussStageData } from "./flussStage";

class FlussFlow<TState extends FlussFlowState = FlussFlowState> {
    #state: TState;
    #data: FlussFlowData;

    // ---------- // -  - // ---------- //

    #stages : readonly FlussStage[];
    #index : number;

    public constructor(state: TState, data: FlussFlowData) {
        this.#state = state;
        this.#data = data;

        const stages = Object.entries(data).map(([name, def]) => {
            return new FlussStage({ flow: this, name }, def);
        });

        this.#stages = Object.freeze(stages);
        this.#index = 0;
    }

    // ------------------------- // -  - // ------------------------- //

    public get state() : TState {
        return this.#state;
    }

    public get stages() : readonly FlussStage[] {
        return this.#stages;
    }

    public get current() : FlussStage | null {
        return this.#stages[this.#index] || null;
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