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
            if(!this.getMainFunc) throw new Error(`Main function is not defined for phase type: ${type}`);

            this.#mainFunc = this.getMainFunc();
            this.#preFunc = this.getPreFunc!();
            this.#postFunc = this.getPostFunc!();
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

    protected getMainFunc?(): FlussPhaseFunc;

    protected getPreFunc?(): FlussPhaseFunc | null;

    protected getPostFunc?(): FlussPhaseFunc | null;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export type FlussPhaseFunc = () => void;