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
                idlePhase: this.idlePhase?.(),
                beginPhase: this.beginPhase?.(),
                runningPhase: this.runningPhase?.(),
                endPhase: this.endPhase?.(),
                completedPhase: this.completedPhase?.(),
                cancelledPhase: this.cancelledPhase?.()
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
    idlePhase?: FlussPhaseDef;
    beginPhase?: FlussPhaseDef;
    runningPhase?: FlussPhaseDef;
    endPhase?: FlussPhaseDef;
    completedPhase?: FlussPhaseDef;
    cancelledPhase?: FlussPhaseDef;
}

export type FlussStageType = new (name: string) => FlussBoundStage;

export type FlussStageDef = FlussStageData | FlussStageType;

// ------------------------------ // -  - // ------------------------------ //

export const isStageData = (def: FlussStageDef): def is FlussStageData => {
    return typeof def === 'object' && !isStageType(def);
};

export const isStageType = (def: FlussStageDef): def is FlussStageType => {
    return typeof def === 'function' && !!def.prototype?.constructor;
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