import { FlussFlowData, FlussFlowDef, FlussFlowFixedKey, FlussFlowFlexKey } from "./flussFlow";
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
}

export default fluss;

// ------------------------------ // -  - // ------------------------------ //

export enum FlussResult {
    Success = 'success',
    Failure = 'failure',
    Skipped = 'skipped',
    TimedOut = 'timedOut'
}

export enum FlussCommand {
    Continue = 'continue',
    Abort = 'abort',
}

export type FlussReturn<T> = T | void;