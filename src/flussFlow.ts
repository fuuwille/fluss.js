import FlussStage, { createStage, FlussStageDef } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;
    #stages : readonly FlussStage[];

    constructor(data: FlussFlowData, modifier? : FlussFlowModifier) {     
        this.#data = data;

        const stages = Object.entries(data).map(([name, def]) => {
            return null! as FlussStage //createStage(name, def.src, def.priority);
        });

        if (modifier) {
            modifier(stages);
        }

        const sortedStages = stages.sort((a, b) => {
            return (b.priority ?? Infinity) - (a.priority ?? Infinity);
        });

        this.#stages = [...sortedStages];
    }

    // ------------------------- // -  - // ------------------------- //

    public get stages() : readonly FlussStage[] {
        return this.#stages;
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