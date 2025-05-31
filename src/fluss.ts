import FlussFlow, { FlussFlowData, FlussFlowKey, FlussFlowState } from "./flussFlow";

class fluss {
    private constructor() {
    }

    // ------------------------- // -  - // ------------------------- //

    public static fixedFlow = <TKey extends FlussFlowKey, TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<TKey>) : FlussFlow<string, TState> => {
        return new FlussFlow<TKey, TState>(state, data);
    }

    public static flexFlow = <TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<null>) : FlussFlow<null, TState> => {
        return new FlussFlow<null, TState>(state, data);
    }
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //