import { FlussStageDef } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;

    constructor(data: FlussFlowData, modifier? : FlussFlowModifier) {     
        this.#data = data;
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData = {
    [key: string] : FlussStageDef;
}

export type FlussFlowModifier = (stages : FlussStage[]) => void;

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData, modifier? : FlussFlowModifier): FlussFlow => {
    return new FlussFlow(data, modifier);
}