import { getPostPhase, getPrePhase, MainPhaseType, PostPhaseType, PrePhaseType } from "./flussPhaseType";

class FlussPhase {
    #type : MainPhaseType;
    #preType : PrePhaseType;
    #postType : PostPhaseType;
    #mainFunc : FlussPhaseFunc | null = null;
    #preFunc : FlussPhaseFunc | null = null;
    #postFunc : FlussPhaseFunc | null = null;

    constructor(type: MainPhaseType);

    constructor(type: MainPhaseType, mainFunc: FlussPhaseFunc, preFunc?: FlussPhaseFunc, postFunc?: FlussPhaseFunc);

    constructor(type: MainPhaseType, mainFunc?: FlussPhaseFunc, preFunc?: FlussPhaseFunc, postFunc?: FlussPhaseFunc) {
        this.#type = type;
        this.#preType = getPrePhase(type);
        this.#postType = getPostPhase(type);

        if(mainFunc) {
            this.#mainFunc = mainFunc;
            this.#preFunc = preFunc ?? null;
            this.#postFunc = postFunc ?? null;
        }
        else {
            if(!this.bindMainFunc) throw new Error(`Main function is not defined for phase type: ${type}`);

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

    protected bindMainFunc?(): FlussPhaseFunc;

    protected bindPreFunc?(): FlussPhaseFunc | null;

    protected bindPostFunc?(): FlussPhaseFunc | null;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseFunc = () => void;