import FlussAction from "./flussAction";
import { getPostPhase, getPrePhase, MainPhaseType, PostPhaseType, PrePhaseType } from "./flussPhaseType";

class FlussPhase {
    #type : MainPhaseType;
    #preType : PrePhaseType;
    #postType : PostPhaseType;
    #mainFunc : FlussAction | null = null;
    #preFunc : FlussAction | null = null;
    #postFunc : FlussAction | null = null;

    constructor(type: MainPhaseType);

    constructor(type: MainPhaseType, mainFunc: FlussAction, preFunc?: FlussAction, postFunc?: FlussAction);

    constructor(type: MainPhaseType, mainFunc?: FlussAction, preFunc?: FlussAction, postFunc?: FlussAction) {
        this.#type = type;
        this.#preType = getPrePhase(type);
        this.#postType = getPostPhase(type);

        if(mainFunc) {
            this.#mainFunc = mainFunc;
            this.#preFunc = preFunc ?? null;
            this.#postFunc = postFunc ?? null;
        }
        else {
            if(!this.bindMainFunc || !this.bindPreFunc || !this.bindPostFunc) 
                throw new Error(`FlussPhase: Missing phase functions for type ${type}.`);

            this.#mainFunc = this.bindMainFunc();
            this.#preFunc = this.bindPreFunc!();
            this.#postFunc = this.bindPostFunc!();
        }
    }

    // ------------------------- // -  - // ------------------------- //
    
    public get type(): MainPhaseType {
        return this.#type;
    }

    public get preType(): PrePhaseType {
        return this.#preType;
    }

    public get postType(): PostPhaseType {
        return this.#postType;
    }

    // ------------------------- // -  - // ------------------------- //

    protected bindMainFunc?(): FlussAction;

    protected bindPreFunc?(): FlussAction | null;

    protected bindPostFunc?(): FlussAction | null;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export abstract class FlussBoundPhase extends FlussPhase {
    constructor(type: MainPhaseType) {
        super(type);
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