import { FlussPhaseData } from "./flussPhase";

class FlussStage {  
    #name : string;
    #data : FlussStageData;

    constructor(name : string);

    constructor(name : string, data : FlussStageData);

    constructor(name : string, data? : FlussStageData) {
        this.#name = name;

        if(!data) {
            if(this.bindPhase) {
                data = this.bindPhase();
            } else {
                throw new Error(`FlussStage: No phase bundle provided for stage ${name}.`);
            }
        }

        this.#data = data;
    }

    protected bindPhase?(): FlussStageData;

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

    protected bindPhase(): FlussStageData {
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

    protected idlePhase?() : FlussPhaseData

    protected beginPhase?() : FlussPhaseData;

    protected runningPhase?() : FlussPhaseData;

    protected endPhase?() : FlussPhaseData;

    protected completedPhase?() : FlussPhaseData;

    protected cancelledPhase?() : FlussPhaseData;
}

export default FlussStage;

// ------------------------------ // -  - // ------------------------------ //

export type FlussStageDef = {
    phases: FlussStageData;
}

export type FlussStageBundle = {
    [key: string]: FlussStageDef;
}

export type FlussStageData = {
    idle?: FlussPhaseData;
    begin?: FlussPhaseData;
    running?: FlussPhaseData;
    end?: FlussPhaseData;
    completed?: FlussPhaseData;
    cancelled?: FlussPhaseData;
}