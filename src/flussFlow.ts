import { FlussStageDef } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;

    constructor(data: FlussFlowData) {     
        this.#data = data;
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData = {
    [key: string] : FlussStageDef;
}

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData): FlussFlow => {
    return new FlussFlow(data);
}