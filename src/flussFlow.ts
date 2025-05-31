import { FlussStageData } from "./flussStage";

class FlussFlow {
    public constructor() {

    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData = {
    [key: string]: FlussStageData;
}