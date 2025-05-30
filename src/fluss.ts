import FlussFlow from "./flussFlow";
import { FlussPhaseDef, FlussPhaseSource } from "./flussPhase";
import { FlussStageDef, FlussStageRef, FlussStageSource } from "./flussStage";

class fluss {

    private constructor() {     
    }

    // ------------------------- // -  - // ------------------------- //

    public static stageRef(flow : FlussFlow, name : string) : FlussStageRef {
        return { flow, name };
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