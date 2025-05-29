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
            pendingPhase: this.pendingPhase?.(),
            beginPhase: this.beginPhase?.(),
            runningPhase: this.runningPhase?.(),
            endPhase: this.endPhase?.(),
            completedPhase: this.completedPhase?.(),
            cancelledPhase: this.cancelledPhase?.()
        };
    }

    // ------------------------- // -  - // ------------------------- //

    protected pendingPhase?() : FlussPhaseDef

    protected beginPhase?() : FlussPhaseDef;

    protected runningPhase?() : FlussPhaseDef;

    protected endPhase?() : FlussPhaseDef;

    protected completedPhase?() : FlussPhaseDef;

    protected cancelledPhase?() : FlussPhaseDef;
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageData = {
    pendingPhase?: FlussPhaseDef;
    beginPhase?: FlussPhaseDef;
    runningPhase?: FlussPhaseDef;
    endPhase?: FlussPhaseDef;
    completedPhase?: FlussPhaseDef;
    cancelledPhase?: FlussPhaseDef;
}

export type FlussStageType = new (name: string) => FlussBoundStage;

export type FlussStageSource = FlussStageData | FlussStageType;

export type FlussStageDef = {
    src : FlussStageSource;
    priority?: number;
}

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

export const defineStage = (src : FlussStageSource, priority? : number): FlussStageDef => {
    return {
        src,
        priority
    }
}