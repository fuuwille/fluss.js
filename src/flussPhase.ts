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
            if(this.bindAction) {
                data = this.bindAction();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided for mode ${mode}.`);
            }
        }

        this.#data = data;
    }

    protected bindAction?(): FlussPhaseData;

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
        return new FlussPhase(def.mode, def.content);
    }
}

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(mode: MainMode) {
        super(mode);
    }

    protected bindAction(): FlussPhaseData {
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

export type FlussPhaseDef = {
    mode: MainMode;
    content: FlussPhaseData;
}

export type FlussPhaseBundle = {
    idle?: FlussPhaseDef;
    begin?: FlussPhaseDef;
    running?: FlussPhaseDef;
    end?: FlussPhaseDef;
    completed?: FlussPhaseDef;
    cancelled?: FlussPhaseDef;
}

export type FlussPhaseData = {
    main: FlussAction;
    pre?: FlussAction;
    post?: FlussAction;
}