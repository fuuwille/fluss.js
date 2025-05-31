import FlussFlow, { FlussFlowData, FlussFlowState } from "./flussFlow";

class fluss {
    private constructor() {
    }

    // ------------------------- // -  - // ------------------------- //

    public static fixedFlow = <TState extends FlussFlowState = FlussFlowState>(state : TState, data: FlussFlowData<string>) : FlussFlow<string, TState> => {
        return new FlussFlow<string, TState>(state, data);
    }
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //