import fluss from "./fluss";
import FlussFlow from "./flussFlow";
import FlussPhase, { createPhase, FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #ref : FlussStageRef;
    #priority : number;
    #mode : FlussStageMode;

    // ---------- // -  - // ---------- //

    #pendingPhase: FlussPhase | null;
    #beginningPhase: FlussPhase | null;
    #runningPhase: FlussPhase | null;
    #endingPhase: FlussPhase | null;
    #completedPhase: FlussPhase | null;
    #cancelledPhase: FlussPhase | null;
    #failedPhase: FlussPhase | null;
    #timedOutPhase: FlussPhase | null;

    // ---------- // -  - // ---------- //

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
        this.#mode = FlussStageMode.None;

        // ---------- // -  - // ---------- //

        this.#pendingPhase = data.pending ? createPhase(fluss.phaseRef(this, FlussStageMode.Pending), data.pending.src) : null;
        this.#beginningPhase = data.beginning ? createPhase(fluss.phaseRef(this, FlussStageMode.Beginning), data.beginning.src) : null;
        this.#runningPhase = data.running ? createPhase(fluss.phaseRef(this, FlussStageMode.Running), data.running.src) : null;
        this.#endingPhase = data.ending ? createPhase(fluss.phaseRef(this, FlussStageMode.Ending), data.ending.src) : null;
        this.#completedPhase = data.completed ? createPhase(fluss.phaseRef(this, FlussStageMode.Completed), data.completed.src) : null;
        this.#cancelledPhase = data.cancelled ? createPhase(fluss.phaseRef(this, FlussStageMode.Cancelled), data.cancelled.src) : null;
        this.#failedPhase = data.failed ? createPhase(fluss.phaseRef(this, FlussStageMode.Failed), data.failed.src) : null;
        this.#timedOutPhase = data.timedOut ? createPhase(fluss.phaseRef(this, FlussStageMode.TimedOut), data.timedOut.src) : null;
    }

    // ---------- // -  - // ---------- //

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

    // ------------------------- // -  - // ------------------------- //

    public get currentPhase(): FlussPhase | null {
        switch(this.#mode) {
            case FlussStageMode.Pending:
                return this.#pendingPhase;
            case FlussStageMode.Beginning:
                return this.#beginningPhase;
            case FlussStageMode.Running:
                return this.#runningPhase;
            case FlussStageMode.Ending:
                return this.#endingPhase;
            case FlussStageMode.Completed:
                return this.#completedPhase;
            case FlussStageMode.Cancelled:
                return this.#cancelledPhase;
            case FlussStageMode.Failed:
                return this.#failedPhase;
            case FlussStageMode.TimedOut:
                return this.#timedOutPhase;
            default:
                return null;
        }
    }

    public get pendingPhase(): FlussPhase | null {
        return this.#pendingPhase;
    }

    public get beginningPhase(): FlussPhase | null {
        return this.#beginningPhase;
    }

    public get runningPhase(): FlussPhase | null {
        return this.#runningPhase;
    }

    public get endingPhase(): FlussPhase | null {
        return this.#endingPhase;
    }

    public get completedPhase(): FlussPhase | null {
        return this.#completedPhase;
    }

    public get cancelledPhase(): FlussPhase | null {
        return this.#cancelledPhase;
    }

    public get failedPhase(): FlussPhase | null {
        return this.#failedPhase;
    }

    public get timedOutPhase(): FlussPhase | null {
        return this.#timedOutPhase;
    }

    // ------------------------- // -  - // ------------------------- //

    public run() : boolean {
        if(!this.isPending()) {
            return false;
        }

        this.#mode = FlussStageMode.Beginning;
        this.#beginningPhase?.execute();

        this.#mode = FlussStageMode.Running;
        this.#runningPhase?.execute();

        this.#mode = FlussStageMode.Ending;
        this.#endingPhase?.execute();

        return true;
    }

    public finalize() : boolean {
        if(!this.isEnd()) {
            return false;
        }

        this.#mode = FlussStageMode.Completed;
        this.#completedPhase?.execute();

        return true;
    }

    // ------------------------- // -  - // ------------------------- //

    public isNone() : boolean {
        return this.#mode === FlussStageMode.None;
    }

    public isPending() : boolean {
        return (this.#mode & FlussStageMode.Pending) !== 0;
    }

    public isBegin() : boolean {
        return (this.#mode & FlussStageMode.Beginning) !== 0;
    }

    public isRunning() : boolean {
        return (this.#mode & FlussStageMode.Running) !== 0;
    }

    public isEnd() : boolean {
        return (this.#mode & FlussStageMode.Ending) !== 0;
    }

    public isFinalized() : boolean {
        return (this.#mode & (FlussStageMode.Completed | FlussStageMode.Cancelled | FlussStageMode.Failed | FlussStageMode.TimedOut)) !== 0;
    }

    public isCompleted() : boolean {
        return (this.#mode & FlussStageMode.Completed) !== 0;
    }

    public isCancelled() : boolean {
        return (this.#mode & FlussStageMode.Cancelled) !== 0;
    }

    public isFailed() : boolean {
        return (this.#mode & FlussStageMode.Failed) !== 0;
    }
}

export abstract class FlussBoundStage extends FlussStage {
    constructor(ref : FlussStageRef, priority : number) {
        super(ref, priority);
    }

    protected bind(): FlussStageData {
        return {
            pending: this.pendingDef?.(),
            beginning: this.beginningDef?.(),
            running: this.runningDef?.(),
            ending: this.endingDef?.(),
            completed: this.completedDef?.(),
            cancelled: this.cancelledDef?.(),
            failed: this.failedDef?.(),
            timedOut: this.timedOutDef?.()
        };
    }

    // ------------------------- // -  - // ------------------------- //

    protected pendingDef?() : FlussPhaseDef

    protected beginningDef?() : FlussPhaseDef;

    protected runningDef?() : FlussPhaseDef;

    protected endingDef?() : FlussPhaseDef;

    protected completedDef?() : FlussPhaseDef;

    protected cancelledDef?() : FlussPhaseDef;

    protected failedDef?() : FlussPhaseDef;

    protected timedOutDef?() : FlussPhaseDef;
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
    beginning?: FlussPhaseDef;
    running?: FlussPhaseDef;
    ending?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
    failed?: FlussPhaseDef;
    timedOut?: FlussPhaseDef;
}

export enum FlussStageMode {
    None = 0,
    Pending = 1 << 0,
    Beginning = 1 << 1,
    Running = 1 << 2,
    Ending = 1 << 3,

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

    throw new Error(`FlussStage: Invalid stage definition for ${ref.name}. Expected FlussPhaseData or FlussStageType.`);
}