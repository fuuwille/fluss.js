import FlussFlow, { FlussFlowData, FlussFlowKey, FlussFlowState } from "./flussFlow";

class fluss {
    private constructor() {
    }

    // ------------------------- // -  - // ------------------------- //

    public static fixedFlow = <TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<string>) : FlussFlow<string, TState> => {
        return new FlussFlow<string, TState>(state, data);
    }

    public static flexFlow = <TKey extends FlussFlowKey, TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<TKey>) : FlussFlow<TKey, TState> => {
        return new FlussFlow<TKey, TState>(state, data);
    }
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //