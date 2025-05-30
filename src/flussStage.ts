import FlussFlow from "./flussFlow";
import { FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #ref : FlussStageRef;
    #priority : number;
    #data : FlussStageData;
    #mode : FlussStageMode;

    constructor(ref : FlussStageRef, priority : number);

    constructor(ref : FlussStageRef, priority : number, data : FlussStageData);

    constructor(ref : FlussStageRef, priority : number, data? : FlussStageData) {
        this.#ref = ref;

        if(!data) {
            if(this.bind) {
                data = this.bind();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#priority = priority;
        this.#data = data;
        this.#mode = FlussStageMode.None;
    }

    protected bind?(): FlussStageData;

    // ------------------------- // -  - // ------------------------- //

    public get ref(): FlussStageRef {
        return this.#ref;
    }

    public get priority(): number {
        return this.#priority;
    }
    
    public get mode(): FlussStageMode {
        return this.#mode;
    }
}

export abstract class FlussBoundStage extends FlussStage {
    constructor(ref : FlussStageRef, priority : number) {
        super(ref, priority);
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

export type FlussStageRef = {
    flow: FlussFlow;
    name : string;
}

export type FlussStagePriority = number | (() => number);

export type FlussStageData = {
    pending?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}

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

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageType = new (ref: FlussStageRef, priority: number) => FlussBoundStage;

export type FlussStageSource = FlussStageData | FlussStageType;

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

export const createStage = (ref: FlussStageRef, src : FlussStageSource, priority?: FlussStagePriority): FlussStage => {
    const _priority = typeof priority === 'function' ? priority() : priority ?? 0;

    if(isStageData(src)) {
        return new FlussStage(ref, _priority, src);
    }
    if(isStageType(src)) {
        return new src(ref, _priority);
    }

    throw new Error(`FlussStage: Invalid stage definition for ${name}. Expected FlussPhaseData or FlussStageType.`);
}