import FlussPhase, { FlussPhaseBundle } from "./flussPhase";

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

    protected idlePhase?() : FlussPhase

    protected beginPhase?() : FlussPhase;

    protected runningPhase?() : FlussPhase;

    protected endPhase?() : FlussPhase;

    protected completedPhase?() : FlussPhase;

    protected cancelledPhase?() : FlussPhase;
}

export default FlussStage;