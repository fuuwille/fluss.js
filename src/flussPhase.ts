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
            main: this.onMain.bind(this),
            pre: this.onPre?.bind(this) ?? undefined,
            post: this.onPost?.bind(this) ?? undefined
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
    main: FlussAction;
    pre?: FlussAction;
    post?: FlussAction;
}

export type FlussPhaseType = new (mode : MainMode) => FlussPhase;

export type FlussPhaseDef = FlussPhaseData | FlussPhaseType;

// ------------------------------ // -  - // ------------------------------ //

export const isPhaseData = (def: FlussPhaseDef): def is FlussPhaseData => {
    return typeof def === 'object' && !isPhaseType(def);
};

export const isPhaseType = (def: FlussPhaseDef): def is FlussPhaseType => {
    return typeof def === 'function' && !!def.prototype?.constructor;
}

// ------------------------------ // -  - // ------------------------------ //

export const createPhase = (mode: MainMode, def: FlussPhaseDef): FlussPhase => {
    if(isPhaseData(def)) {
        return new FlussPhase(mode, def);
    }
    if(isPhaseType(def)) {
        return new def(mode);
    }

    throw new Error(`FlussPhase: Invalid phase definition for mode ${mode}. Expected FlussPhaseData or FlussPhaseType.`);
}