import FlussAction, { FlussActionBundle } from "./flussAction";
import { getPostMode, getPreMode, MainMode, PostMode, PreMode } from "./flussMode";

class FlussPhase {
    #mode : MainMode;
    #preMode : PreMode;
    #postMode : PostMode;
    #actionBundle : FlussActionBundle;

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

        this.#actionBundle = actionBundle;
    }

    protected bindAction?(): FlussActionBundle;

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

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(mode: MainMode) {
        super(mode);
    }

    protected bindAction(): FlussActionBundle {
        return {
            main: this.onMain.bind(this),
            pre: this.onPre?.bind(this) ?? null,
            post: this.onPost?.bind(this) ?? null
        }
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract onMain(): void;

    public onPre?(): void;

    public onPost?(): void;
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