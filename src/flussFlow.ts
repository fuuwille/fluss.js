import fluss from "./fluss";
import FlussStage, { createStage, FlussStageDef, FlussStagePriority, FlussStageSource } from "./flussStage";

class FlussFlow {
    #data : FlussFlowData;
    #stages : readonly FlussStage[];
    #current : FlussStage | null = null;

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
        this.#current = this.#stages.length > 0 ? this.#stages[0] : null;
    }

    // ------------------------- // -  - // ------------------------- //

    public get stages() : readonly FlussStage[] {
        return this.#stages;
    }

    public get current() : FlussStage | null {
        return this.#current;
    }

    // ------------------------- // -  - // ------------------------- //

    public start() : boolean {
        if (!this.#current) {
            return false;
        }

        this.#current.start();
        return true;
    }

    public async startAsync() : Promise<boolean> {
        if (!this.#current) {
            return Promise.resolve(false);
        }

        await this.#current.startAsync();
        return true;
    }

    public run() : boolean {
        if (!this.#current) {
            return false;
        }

        this.#current.run();
        return true;
    }

    public async runAsync() : Promise<boolean> {
        if (!this.#current) {
            return Promise.resolve(false);
        }

        await this.#current.runAsync();
        return true;
    }

    public finalize() : boolean {
        if (!this.#current) {
            return false;
        }

        this.#current.finalize();
        const currentIndex = this.#stages.indexOf(this.#current);

        if (currentIndex >= 0 && currentIndex < this.#stages.length - 1) {
            this.#current = this.#stages[currentIndex + 1];
        } else {
            this.#current = null; // No more stages to process
        }

        return true;
    }

    public async finalizeAsync() : Promise<boolean> {
        if (!this.#current) {
            return Promise.resolve(false);
        }

        await this.#current.finalizeAsync();
        const currentIndex = this.#stages.indexOf(this.#current);

        if (currentIndex >= 0 && currentIndex < this.#stages.length - 1) {
            this.#current = this.#stages[currentIndex + 1];
        } else {
            this.#current = null; // No more stages to process
        }

        return true;
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

    public get stages(): FlussStage[] {
        return this.#stages;
    }

    // ------------------------- // -  - // ------------------------- //

    public createStage(name : string, src : FlussStageSource, priority? : FlussStagePriority) : FlussStage {
        return createStage(fluss.stageRef(this.#flow, name), src, priority);
    }
}

// ------------------------------ // -  - // ------------------------------ //

export const createFlow = (data: FlussFlowData, modifier? : FlussFlowModifier): FlussFlow => {
    return new FlussFlow(data, modifier);
}