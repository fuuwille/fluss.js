import FlussAction from "./flussAction";
import { getPostMode, getPreMode, MainMode, PostMode, PreMode } from "./flussMode";

class FlussPhase {
    #mode : MainMode;
    #preMode : PreMode;
    #postMode : PostMode;
    #mainFunc : FlussAction | null = null;
    #preFunc : FlussAction | null = null;
    #postFunc : FlussAction | null = null;

    constructor(mode: MainMode);

    constructor(mode: MainMode, mainFunc: FlussAction, preFunc?: FlussAction, postFunc?: FlussAction);

    constructor(mode: MainMode, mainFunc?: FlussAction, preFunc?: FlussAction, postFunc?: FlussAction) {
        this.#mode = mode;
        this.#preMode = getPreMode(mode);
        this.#postMode = getPostMode(mode);

        if(mainFunc) {
            this.#mainFunc = mainFunc;
            this.#preFunc = preFunc ?? null;
            this.#postFunc = postFunc ?? null;
        }
        else {
            if(!this.bindMainFunc || !this.bindPreFunc || !this.bindPostFunc) 
                throw new Error(`FlussPhase: Missing phase functions for type ${mode}.`);

            this.#mainFunc = this.bindMainFunc();
            this.#preFunc = this.bindPreFunc!();
            this.#postFunc = this.bindPostFunc!();
        }
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

    protected bindMainFunc?(): FlussAction;

    protected bindPreFunc?(): FlussAction | null;

    protected bindPostFunc?(): FlussAction | null;
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