import FlussFlow, { FlussFlowData, FlussFlowDef, FlussFlowFixedKey, FlussFlowFlexKey, FlussFlowState } from "./flussFlow";
import { FlussStageData, FlussStageDef } from "./flussStage";

class fluss {
    private constructor() {
    }

    // ------------------------- // -  - // ------------------------- //

    public static fixedFlow = <TKey extends string>(data: FlussFlowData<FlussFlowFixedKey<TKey>>) : FlussFlowDef<FlussFlowFixedKey<TKey>> => {
        return { src : data };
    }

    public static flexFlow = (data: FlussFlowData<FlussFlowFlexKey>) : FlussFlowDef<FlussFlowFlexKey> => {
        return { src : data }
    }

    public static stage = (data : FlussStageData) : FlussStageDef => {
        return { src: data };
    }

    // ------------------------- // -  - // ------------------------- //

    public static get success() : FlussResult {
        return 'success' as FlussResult;
    }

    public static get failure() : FlussResult {
        return 'failure' as FlussResult;
    }

    public static get skipped() : FlussResult {
        return 'skipped' as FlussResult;
    }

    public static get timedOut() : FlussResult {
        return 'timedOut' as FlussResult;
    }
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussResult = FlussResultFlag & { __brand: "flussResult" };

export type FlussResultFlag = 'success' | 'failure' | 'skipped' | 'timedOut';