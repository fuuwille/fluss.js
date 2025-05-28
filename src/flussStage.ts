import { FlussPhaseBundle, FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #name : string;
    #phaseBundle : FlussPhaseBundle;

    constructor(name : string);

    constructor(name : string, phaseBundle : FlussPhaseBundle);

    constructor(name : string, phaseBundle? : FlussPhaseBundle) {
        this.#name = name;

        if(!phaseBundle) {
            if(this.bindPhase) {
                phaseBundle = this.bindPhase();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#phaseBundle = phaseBundle;
    }

    protected bindPhase?(): FlussPhaseBundle;

    // ------------------------- // -  - // ------------------------- //

    public get name(): string {
        return this.#name;
    }
}

export abstract class FlussBoundStage extends FlussStage {
    constructor(name : string) {
        super(name);
    }

    protected bindPhase(): FlussPhaseBundle {
        return {
            idle: this.idlePhase?.() ?? undefined,
            begin: this.beginPhase?.() ?? undefined,
            running: this.runningPhase?.() ?? undefined,
            end: this.endPhase?.() ?? undefined,
            completed: this.completedPhase?.() ?? undefined,
            cancelled: this.cancelledPhase?.() ?? undefined
        };
    }

    // ------------------------- // -  - // ------------------------- //

    protected idlePhase?() : FlussPhaseDef

    protected beginPhase?() : FlussPhaseDef;

    protected runningPhase?() : FlussPhaseDef;

    protected endPhase?() : FlussPhaseDef;

    protected completedPhase?() : FlussPhaseDef;

    protected cancelledPhase?() : FlussPhaseDef;
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageDef = {
    name: string;
    phaseBundle: FlussPhaseBundle;
}

export type FlussStageBundle = {
    [key: string]: FlussStage;
}