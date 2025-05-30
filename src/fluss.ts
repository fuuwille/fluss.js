import { FlussPhaseDef, FlussPhaseSource } from "./flussPhase";
import { FlussStageDef, FlussStageSource } from "./flussStage";

class Fluss {

    private constructor() {     
    }

    // ------------------------- // -  - // ------------------------- //

    public static stage(src : FlussStageSource, priority? : number) : FlussStageDef {
        return { src, priority }
    }

    public static phase(src : FlussPhaseSource) : FlussPhaseDef {
        return { src }
    }
}

export default Fluss;