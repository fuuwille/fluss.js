import { FlussPhaseData, FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #name : string;
    #data : FlussStageData;

    constructor(name : string);

    constructor(name : string, data : FlussStageData);

    constructor(name : string, data? : FlussStageData) {
        this.#name = name;

        if(!data) {
            if(this.bindPhase) {
                data = this.bindPhase();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#data = data;
    }

    protected bindPhase?(): FlussStageData;

    // ------------------------- // -  - // ------------------------- //

    public get name(): string {
        return this.#name;
    }
}

export abstract class FlussBoundStage extends FlussStage {
    constructor(name : string) {
        super(name);
    }

    protected bindPhase(): FlussStageData {
        return {
            phases: {
                idle: this.idlePhase?.(),
                begin: this.beginPhase?.(),
                running: this.runningPhase?.(),
                end: this.endPhase?.(),
                completed: this.completedPhase?.(),
                cancelled: this.cancelledPhase?.()
            }
        };
    }

    // ------------------------- // -  - // ------------------------- //

    protected idlePhase?() : FlussPhaseData

    protected beginPhase?() : FlussPhaseData;

    protected runningPhase?() : FlussPhaseData;

    protected endPhase?() : FlussPhaseData;

    protected completedPhase?() : FlussPhaseData;

    protected cancelledPhase?() : FlussPhaseData;
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageData = {
    phases : FlussStageDataPhases;
}

export type FlussStageDataPhases = {
    idle?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}

export type FlussStageType = new (name: string) => FlussBoundStage;

export type FlussStageDef = FlussStageData | FlussStageType;

// ------------------------------ // -  - // ------------------------------ //

export const isStageData = (obj: any): obj is FlussStageData => {
    return typeof obj === 'object' && !isStageType(obj);
};

export const isStageType = (obj: any): obj is FlussStageType => {
    return typeof obj === 'function' && !!obj.prototype?.constructor;
}

// ------------------------------ // -  - // ------------------------------ //

export const createStage = (name: string, def: FlussStageDef): FlussStage => {
    if(isStageData(def)) {
        return new FlussStage(name, def);
    }
    if(isStageType(def)) {
        return new def(name);
    }

    throw new Error(`FlussStage: Invalid stage definition for ${name}. Expected FlussPhaseData or FlussStageType.`);
}