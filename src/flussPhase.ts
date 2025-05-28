import { FlussActionBundle } from "./flussAction";
import { getPostMode, getPreMode, MainMode, PostMode, PreMode } from "./flussMode";

class FlussPhase {
    #mode : MainMode;
    #preMode : PreMode;
    #postMode : PostMode;
    #actions : FlussActionBundle;

    constructor(mode: MainMode);

    constructor(mode: MainMode, actions : FlussActionBundle);

    constructor(mode: MainMode, actions? : FlussActionBundle) {
        this.#mode = mode;
        this.#preMode = getPreMode(mode);
        this.#postMode = getPostMode(mode);

        if(!actions) {
            if(this.bindAction) {
                actions = this.bindAction();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided for mode ${mode}.`);
            }
        }

        this.#actions = actions;
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

    // ------------------------- // -  - // ------------------------- //

    public create(def : FlussPhaseDef) : FlussPhase {
        return new FlussPhase(def.mode, def.actions);
    }
}

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

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseDef = {
    mode: MainMode;
    actions: FlussActionBundle;
}

export type FlussPhaseBundle = {
    idle?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}