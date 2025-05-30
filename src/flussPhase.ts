import FlussAction from "./flussAction";
import FlussMode, { FlussCycleMode } from "./flussMode";

class FlussPhase {
    #mode : FlussMode;
    #cycleMode : FlussCycleMode;
    #data : FlussPhaseData;

    constructor(mode: FlussMode);

    constructor(mode: FlussMode, data : FlussPhaseData);

    constructor(mode: FlussMode, data? : FlussPhaseData) {
        this.#mode = mode;
        this.#cycleMode = FlussCycleMode.None;

        if(!data) {
            if(this.bind) {
                data = this.bind();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided for mode ${mode}.`);
            }
        }

        this.#data = data;
    }

    protected bind?(): FlussPhaseData;

    // ------------------------- // -  - // ------------------------- //
    
    public get mode(): FlussMode {
        return this.#mode;
    }

    public get cycleMode(): FlussCycleMode {
        return this.#cycleMode;
    }
}

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(mode: FlussMode) {
        super(mode);
    }

    protected bind(): FlussPhaseData {
        return {
            onMain: this.onMain.bind(this),
            onPre: this.onPre?.bind(this) ?? undefined,
            onPost: this.onPost?.bind(this) ?? undefined
        }
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract onMain(): void;

    public onPre?(): void;

    public onPost?(): void;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseData = {
    onMain: FlussAction;
    onPre?: FlussAction;
    onPost?: FlussAction;
}

export type FlussPhaseType = new (mode : FlussMode) => FlussPhase;

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

export const createPhase = (mode: FlussMode, src : FlussPhaseSource): FlussPhase => {
    if(isPhaseData(src)) {
        return new FlussPhase(mode, src);
    }
    if(isPhaseType(src)) {
        return new src(mode);
    }

    throw new Error(`FlussPhase: Invalid phase definition for mode ${mode}. Expected FlussPhaseData or FlussPhaseType.`);
}