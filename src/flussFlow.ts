import FlussStage, { FlussStageData, FlussStageDef, FlussStageMode } from "./flussStage";

class FlussFlow<TKey extends FlussFlowKey = FlussFlowKey, TState extends FlussFlowState = FlussFlowState> {
    #state: TState;
    #data: FlussFlowData<TKey>;

    // ---------- // -  - // ---------- //

    #stages : readonly FlussStage[];
    #index : number;

    public constructor(state: TState, data: FlussFlowData<TKey>) {
        this.#state = state;
        this.#data = data;

        const stages = Object.entries<FlussStageDef>(data).map(([name, def]) => {
            return new FlussStage({ flow: this, name }, def.src);
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

    // ------------------------- // -  - // ------------------------- //

    public nextStage() : FlussStage | null {
        if(this.#index + 1 >= this.#stages.length) {
            return null;
        }

        if(this.currentStage()?.mode !== FlussStageMode.Completed) {
            return null;
        }

        this.#index++;
        return this.currentStage();
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowKey<T extends string = string> = FlussFlowFixedKey<T> | FlussFlowFlexKey<T>;

export type FlussFlowFixedKey<T extends string = string> = T & { __brand: "flowFixedKey" };

export type FlussFlowFlexKey<T extends string = string> = T & { __brand: "flowFlexKey" };

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowState = {
    [key : string] : any;
}

export type FlussFlowDef<TKey extends FlussFlowKey> = {
    src : FlussFlowData<TKey>;
}

export type FlussFlowData<TKey extends FlussFlowKey> = Record<TKey extends FlussFlowKey<infer T> ? T : never, FlussStageDef>;