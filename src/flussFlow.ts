import { FlussStageDef } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;

    constructor(data: FlussFlowData, generator? : FlussFlowGenerator) {     
        this.#data = data;
    }
}

export default FlussFlow;

// ------------------------------ // -  - // ------------------------------ //

export type FlussFlowData = {
    [key: string] : FlussStageDef;
}

export type FlussFlowGenerator = (stages : FlussStageDef[]) => void;

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData, generator? : FlussFlowGenerator): FlussFlow => {
    return new FlussFlow(data, generator);
}