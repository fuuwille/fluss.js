import fluss from "./fluss";
import FlussStage, { createStage, FlussStageDef } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;
    #stages : readonly FlussStage[];

    constructor(data: FlussFlowData, modifier? : FlussFlowModifier) {     
        this.#data = data;

        const stages = Object.entries(data).map(([name, def]) => {
            return createStage(fluss.stageRef(this, name), def.src, def.priority);
        });

        if (modifier) {
            modifier(new FlussFlowProvider(this, stages));
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

export type FlussFlowModifier = (provider : FlussFlowProvider) => void;

export class FlussFlowProvider {
    #flow : FlussFlow;
    #stages : readonly FlussStage[];

    constructor(flow: FlussFlow, stages: readonly FlussStage[]) {
        this.#flow = flow;
        this.#stages = stages;
    }

    // ------------------------- // -  - // ------------------------- //

    public get flow(): FlussFlow {
        return this.#flow;
    }

    public get stages(): readonly FlussStage[] {
        return this.#stages;
    }
}

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData, modifier? : FlussFlowModifier): FlussFlow => {
    return new FlussFlow(data, modifier);
}