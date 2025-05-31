import FlussFlow, { FlussFlowData, FlussFlowFixedKey, FlussFlowFlexKey, FlussFlowState } from "./flussFlow";

class fluss {
    private constructor() {
    }

    // ------------------------- // -  - // ------------------------- //

    public static fixedFlow = <TKey extends string, TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<FlussFlowFixedKey<TKey>>) : FlussFlow<FlussFlowFixedKey<TKey>, TState> => {
        return new FlussFlow<FlussFlowFixedKey<TKey>, TState>(state, data);
    }

    public static flexFlow = <TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<FlussFlowFixedKey>) : FlussFlow<FlussFlowFixedKey, TState> => {
        return new FlussFlow<FlussFlowFixedKey, TState>(state, data);
    }
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //