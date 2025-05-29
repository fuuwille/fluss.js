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
            pending: this.pending?.(),
            begin: this.begin?.(),
            running: this.running?.(),
            end: this.end?.(),
            completed: this.completed?.(),
            cancelled: this.cancelled?.()
        };
    }

    // ------------------------- // -  - // ------------------------- //

    protected pending?() : FlussPhaseDef

    protected begin?() : FlussPhaseDef;

    protected running?() : FlussPhaseDef;

    protected end?() : FlussPhaseDef;

    protected completed?() : FlussPhaseDef;

    protected cancelled?() : FlussPhaseDef;
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageData = {
    pending?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}

export type FlussStageType = new (name: string) => FlussBoundStage;

export type FlussStageSource = FlussStageData | FlussStageType;

export type FlussStagePriority = number | (() => number);

export type FlussStageDef = {
    src : FlussStageSource;
    priority?: FlussStagePriority;
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