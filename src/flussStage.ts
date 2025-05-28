import { FlussPhaseBundle } from "./flussPhase";

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

export default FlussStage;