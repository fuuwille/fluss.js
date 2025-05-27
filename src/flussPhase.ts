import { getPostPhase, getPrePhase, MainPhaseType, PostPhaseType, PrePhaseType } from "./flussPhaseType";

class FlussPhase {
    #type : MainPhaseType;
    #preType : PrePhaseType;
    #postType : PostPhaseType;

    constructor(type: MainPhaseType) {
        this.#type = type;
        this.#preType = getPrePhase(type);
        this.#postType = getPostPhase(type);
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
}

export default FlussPhase;