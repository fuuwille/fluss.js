import FlussAction, { FlussActionBundle } from "./flussAction";
import { getPostMode, getPreMode, MainMode, PostMode, PreMode } from "./flussMode";

class FlussPhase {
    #mode : MainMode;
    #preMode : PreMode;
    #postMode : PostMode;
    #mainFunc : FlussAction | null = null;
    #preFunc : FlussAction | null = null;
    #postFunc : FlussAction | null = null;

    constructor(mode: MainMode);

    constructor(mode: MainMode, actionBundle : FlussActionBundle);

    constructor(mode: MainMode, actionBundle? : FlussActionBundle) {
        this.#mode = mode;
        this.#preMode = getPreMode(mode);
        this.#postMode = getPostMode(mode);

        if(!actionBundle) {
            if(this.bindAction) {
                actionBundle = this.bindAction();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided for mode ${mode}.`);
            }
        }

        this.#mainFunc = actionBundle.main;
        this.#preFunc = actionBundle.pre ?? null;
        this.#postFunc = actionBundle.post ?? null;
    }

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

    // ------------------------- // -  - // ------------------------- //

    protected bindAction?(): FlussActionBundle;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(mode: MainMode) {
        super(mode);
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract onMain(): void;

    public onPre?(): void;

    public onPost?(): void;

    // ------------------------- // -  - // ------------------------- //

    protected bindMainFunc(): FlussAction {
        return this.onMain.bind(this);
    }

    protected bindPreFunc(): FlussAction | null {
        return this.onPre?.bind(this) ?? null;
    }

    protected bindPostFunc(): FlussAction | null {
        return this.onPost?.bind(this) ?? null;
    }
}

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseBundle = {
    idle?: FlussPhase;
    begin?: FlussPhase;
    running?: FlussPhase;
    end?: FlussPhase;
    completed?: FlussPhase;
    cancelled?: FlussPhase;
}