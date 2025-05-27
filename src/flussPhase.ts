import { MainPhaseType } from "./flussPhaseType";

class FlussPhase {
    #type : MainPhaseType;

    constructor(type: MainPhaseType) {
        this.#type = type;
    }
    

    public get type(): MainPhaseType {
        return this.#type;
    }
}

export default FlussPhase;