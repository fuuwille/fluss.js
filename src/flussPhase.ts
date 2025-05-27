import { getPostPhase, getPrePhase, MainPhaseType, PostPhaseType, PrePhaseType } from "./flussPhaseType";

class FlussPhase {
    #type : MainPhaseType;
    #preType : PrePhaseType;
    #postType : PostPhaseType;
    #mainFunc : FlussPhaseFunc | null = null;
    #preFunc : FlussPhaseFunc | null = null;
    #postFunc : FlussPhaseFunc | null = null;

    constructor(type: MainPhaseType, mainFunc: null, preFunc: null, postFunc:  null);

    constructor(type: MainPhaseType, mainFunc: FlussPhaseFunc, preFunc: FlussPhaseFunc | null, postFunc: FlussPhaseFunc | null);

    constructor(type: MainPhaseType, mainFunc: FlussPhaseFunc | null, preFunc: FlussPhaseFunc | null, postFunc: FlussPhaseFunc | null) {
        this.#type = type;
        this.#preType = getPrePhase(type);
        this.#postType = getPostPhase(type);

        if(mainFunc) {
            this.#mainFunc = mainFunc;
            this.#preFunc = preFunc;
            this.#postFunc = postFunc;
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

    protected pre?(): void {
        this.#preFunc?.();
    }

    protected main?(): void {
        this.#mainFunc?.();
    }

    protected post?(): void {
        this.#postFunc?.();
    }
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseFunc = () => void;