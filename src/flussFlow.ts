import FlussStage, { FlussStageData } from "./flussStage";

class FlussFlow<TKey extends FlussFlowKey = FlussFlowKey, TState extends FlussFlowState = FlussFlowState> {
    #state: TState;
    #data: FlussFlowData<TKey>;

    // ---------- // -  - // ---------- //

    #stages : readonly FlussStage[];
    #index : number;

    public constructor(state: TState, data: FlussFlowData<TKey>) {
        this.#state = state;
        this.#data = data;

        const stages = Object.entries<FlussStageData>(data).map(([name, def]) => {
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

    // ------------------------- // -  - // ------------------------- //

    public currentStage() : FlussStage | null {
        return this.#stages[this.#index] || null;
    }

    public currentName() : string | null {
        const stage = this.currentStage();
        return stage ? stage.ref.name : null;
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData<TKey extends FlussFlowKey> = Record<TKey extends null ? string : TKey, FlussStageData>;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowKey = string | null;

export type FlussFlowState = {
    [key : string] : any;
}