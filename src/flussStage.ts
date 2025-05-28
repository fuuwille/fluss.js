import { FlussPhaseBundle, FlussPhaseContent, FlussPhaseDef } from "./flussPhase";

class FlussStage {  
    #name : string;
    #phases : FlussPhaseBundle;

    constructor(name : string);

    constructor(name : string, phases : FlussPhaseBundle);

    constructor(name : string, phases? : FlussPhaseBundle) {
        this.#name = name;

        if(!phases) {
            if(this.bindPhase) {
                phases = this.bindPhase();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#phases = phases;
    }

    protected bindPhase?(): FlussPhaseBundle;

    // ------------------------- // -  - // ------------------------- //

    public get name(): string {
        return this.#name;
    }

    // ------------------------- // -  - // ------------------------- //
        
    public create(name : string, def : FlussStageDef) : FlussStage {
        return new FlussStage(name, def.phases);
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
    phases: FlussPhaseBundle;
}

export type FlussStageBundle = {
    [key: string]: FlussStageDef;
}

export type FlussStageContent = {
    idle?: FlussPhaseContent;
    begin?: FlussPhaseContent;
    running?: FlussPhaseContent;
    end?: FlussPhaseContent;
    complete?: FlussPhaseContent;
    cancelled?: FlussPhaseContent;
}