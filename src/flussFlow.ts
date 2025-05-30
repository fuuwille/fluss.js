import fluss from "./fluss";
import FlussStage, { createStage, FlussStageDef, FlussStagePriority, FlussStageSource } from "./flussStage";

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
    #stages : FlussStage[];

    constructor(flow: FlussFlow, stages: FlussStage[]) {
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

    // ------------------------- // -  - // ------------------------- //

    public createStage(name : string, src : FlussStageSource, priority? : FlussStagePriority) : FlussStage {
        const stage = createStage(fluss.stageRef(this.#flow, name), src, priority);
        this.#stages.push(stage);

        return stage;
    }

    public findStage(name: string) : FlussStage | undefined {
        return this.#stages.find(stage => stage.ref.name === name);
    }

    public atStage(index: number) : FlussStage | undefined {
        return this.#stages[index];
    }
}

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData, modifier? : FlussFlowModifier): FlussFlow => {
    return new FlussFlow(data, modifier);
}