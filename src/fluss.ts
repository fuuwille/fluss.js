import { FlussPhaseDef, FlussPhaseSource } from "./flussPhase";
import { FlussStageDef, FlussStageSource } from "./flussStage";

class Fluss {
    #data : FlussData;

    constructor(data: FlussData) {     
        this.#data = data;
    }

    // ------------------------------ // -  - // ------------------------------ //

    public static stage(src : FlussStageSource, priority? : number) : FlussStageDef {
        return { src, priority }
    }

    public static phase(src : FlussPhaseSource) : FlussPhaseDef {
        return { src }
    }
}

export default Fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussData = {
    [key: string] : FlussStageDef;
}

// ------------------------------ // -  - // ------------------------------ //

export const createFluss = (data: FlussData): Fluss => {
    return new Fluss(data);
}