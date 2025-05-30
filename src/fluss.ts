import { FlussPhaseDef, FlussPhaseSource } from "./flussPhase";
import { FlussStageDef, FlussStageSource } from "./flussStage";

class fluss {

    private constructor() {     
    }

    // ------------------------- // -  - // ------------------------- //

    public static stageDef(src : FlussStageSource, priority? : number) : FlussStageDef {
        return { src, priority }
    }

    public static phaseDef(src : FlussPhaseSource) : FlussPhaseDef {
        return { src }
    }
}

export default fluss;