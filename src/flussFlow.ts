import FlussStage, { FlussStageDef, FlussStageMode } from "./flussStage";

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

    public get current() : FlussStage | null {
        return this.#stages[this.#index] || null;
    }

    // ------------------------- // -  - // ------------------------- //

    public continue() : FlussStage | null {
        if(this.#index < 0 || this.#index + 1 >= this.#stages.length) {
            return null;
        }

        if(!this.current) {
            return null;
        }

        if(this.current.mode !== FlussStageMode.Completed) {
            return null;
        }

        this.#index++;

        if(this.current) {
            this.current.executeAsync();
        }

        return this.current;
    }

    public async continueAsync() : Promise<FlussStage | null> {
        if(this.#index + 1 >= this.#stages.length) {
            return Promise.resolve(null);
        }

        if(this.current?.mode !== FlussStageMode.Completed) {
            return Promise.resolve(null);
        }

        this.#index++;

        if(this.current) {
            await this.current.executeAsync();
        }

        return Promise.resolve(this.current);
    }

    public abort() : boolean {
        if(this.#index < 0 || this.#index >= this.#stages.length) {
            return false;
        }

        if(!this.current) {
            return false;
        }

        if(this.current.mode === FlussStageMode.Idle || this.current.mode === FlussStageMode.Completed) {
            this.#index = -1;
            return true;
        }

        return false;
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

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = <TKey extends FlussFlowKey, TState extends FlussFlowState>(state: TState, def: FlussFlowDef<TKey>) : FlussFlow<TKey, TState> => {
    return new FlussFlow<TKey, TState>(state, def.src);
}