import FlussAction from "./flussAction";
import { getPostMode, getPreMode, MainMode, PostMode, PreMode } from "./flussMode";

class FlussPhase {
    #mode : MainMode;
    #preMode : PreMode;
    #postMode : PostMode;
    #data : FlussPhaseData;

    constructor(mode: MainMode);

    constructor(mode: MainMode, data : FlussPhaseData);

    constructor(mode: MainMode, data? : FlussPhaseData) {
        this.#mode = mode;
        this.#preMode = getPreMode(mode);
        this.#postMode = getPostMode(mode);

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
    
    public get mode(): MainMode {
        return this.#mode;
    }

    public get preMode(): PreMode {
        return this.#preMode;
    }

    public get postMode(): PostMode {
        return this.#postMode;
    }
}

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(mode: MainMode) {
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

export type FlussPhaseType = new (mode : MainMode) => FlussPhase;

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

export const createPhase = (mode: MainMode, src : FlussPhaseSource): FlussPhase => {
    if(isPhaseData(src)) {
        return new FlussPhase(mode, src);
    }
    if(isPhaseType(src)) {
        return new src(mode);
    }

    throw new Error(`FlussPhase: Invalid phase definition for mode ${mode}. Expected FlussPhaseData or FlussPhaseType.`);
}