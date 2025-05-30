import { FlussPhaseData, FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #name : string;
    #priority : number;
    #data : FlussStageData;

    constructor(name : string, priority : number);

    constructor(name : string, priority : number, data : FlussStageData);

    constructor(name : string, priority : number, data? : FlussStageData) {
        this.#name = name;

        if(!data) {
            if(this.bind) {
                data = this.bind();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#priority = priority;
        this.#data = data;
    }

    protected bind?(): FlussStageData;

    // ------------------------- // -  - // ------------------------- //

    public get name(): string {
        return this.#name;
    }

    public get priority(): number {
        return this.#priority;
    }
}

export abstract class FlussBoundStage extends FlussStage {
    constructor(name : string, priority : number) {
        super(name, priority);
    }

    protected bind(): FlussStageData {
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

export enum FlussStageMode {
    None = 0,
    Pending = 1 << 0,
    Begin = 1 << 1,
    Running = 1 << 2,
    End = 1 << 3,
    Completed = 1 << 4,
    Cancelled = 1 << 5,
    Failed = 1 << 6,
    TimedOut = 1 << 7,
}

export type FlussStageData = {
    pending?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}

export type FlussStageType = new (name: string, priority: number) => FlussBoundStage;

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

export const createStage = (name: string, src : FlussStageSource, priority?: FlussStagePriority): FlussStage => {
    const _priority = typeof priority === 'function' ? priority() : priority ?? 0;

    if(isStageData(src)) {
        return new FlussStage(name, _priority, src);
    }
    if(isStageType(src)) {
        return new src(name, _priority);
    }

    throw new Error(`FlussStage: Invalid stage definition for ${name}. Expected FlussPhaseData or FlussStageType.`);
}