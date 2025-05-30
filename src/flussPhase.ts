import FlussAction from "./flussAction";
import FlussStage, { FlussStageMode } from "./flussStage";

class FlussPhase {
    #ref : FlussPhaseRef;
    #data : FlussPhaseData;
    #mode : FlussPhaseMode;

    constructor(ref : FlussPhaseRef);

    constructor(ref : FlussPhaseRef, data : FlussPhaseData);

    constructor(ref : FlussPhaseRef, data? : FlussPhaseData) {
        this.#ref = ref;
        this.#mode = FlussPhaseMode.None;

        if(!data) {
            if(this.bind) {
                data = this.bind();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided for ${ref.mode} mode.`);
            }
        }

        this.#data = data;
    }

    protected bind?(): FlussPhaseData;

    // ------------------------- // -  - // ------------------------- //

    public get ref(): FlussPhaseRef {
        return this.#ref;
    }
    
    public get mode(): FlussPhaseMode {
        return this.#mode;
    }
}

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(ref : FlussPhaseRef) {
        super(ref);
    }

    protected bind(): FlussPhaseData {
        return {
            onMain: this.onMain.bind(this),
            onBefore: this.onBefore?.bind(this) ?? undefined,
            onAfter: this.onAfter?.bind(this) ?? undefined
        }
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract onMain(): void;

    public onBefore?(): void | Promise<void>;

    public onAfter?(): void | Promise<void>;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseRef = {
    stage : FlussStage;
    mode : FlussStageMode;
}

export type FlussPhaseData = {
    onMain: FlussAction;
    onBefore?: FlussAction;
    onAfter?: FlussAction;
}

export enum FlussPhaseMode {
    None = 0,
    Pre = 1 << 0,
    Main = 1 << 1,
    Post = 1 << 2,
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseType = new (ref : FlussPhaseRef) => FlussBoundPhase;

export type FlussPhaseSource = FlussPhaseData | FlussPhaseType;

export type FlussPhaseDef = {
    src : FlussPhaseSource;
}

// ------------------------------ // -  - // ------------------------------ //

export const isPhaseData = (obj: any): obj is FlussPhaseData => {
    return typeof obj === 'object' && !isPhaseType(obj);
};

export const isPhaseType = (obj: any): obj is FlussPhaseType => {
    return typeof obj === 'function' && !!obj.prototype?.constructor;
}

// ------------------------------ // -  - // ------------------------------ //

export const createPhase = (ref : FlussPhaseRef, src : FlussPhaseSource): FlussPhase => {
    if(isPhaseData(src)) {
        return new FlussPhase(ref, src);
    }
    if(isPhaseType(src)) {
        return new src(ref);
    }

    throw new Error(`FlussPhase: Invalid phase definition for ${ref.mode} mode. Expected FlussPhaseData or FlussPhaseType.`);
}