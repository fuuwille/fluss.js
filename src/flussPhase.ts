import FlussAction from "./flussAction";

class FlussPhase {
    #mode : FlussPhaseMode;
    #data : FlussPhaseData;

    constructor();

    constructor(data : FlussPhaseData);

    constructor(data? : FlussPhaseData) {
        this.#mode = FlussPhaseMode.None;

        if(!data) {
            if(this.bind) {
                data = this.bind();
            }
            else {
                throw new Error(`FlussPhase: No action bundle provided.`);
            }
        }

        this.#data = data;
    }

    protected bind?(): FlussPhaseData;

    // ------------------------- // -  - // ------------------------- //
    
    public get mode(): FlussPhaseMode {
        return this.#mode;
    }
}

export abstract class FlussBoundPhase extends FlussPhase {
    constructor() {
        super();
    }

    protected bind(): FlussPhaseData {
        return {
            onMain: this.onMain.bind(this),
            onPre: this.onPre?.bind(this) ?? undefined,
            onPost: this.onPost?.bind(this) ?? undefined
        }
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract onMain(): void;

    public onPre?(): void;

    public onPost?(): void;
}

export default FlussPhase;

// ------------------------------ // -  - // ------------------------------ //

export enum FlussPhaseMode {
    None = 0,
    Pre = 1 << 0,
    Main = 1 << 1,
    Post = 1 << 2,
}

export type FlussPhaseData = {
    onMain: FlussAction;
    onPre?: FlussAction;
    onPost?: FlussAction;
}

export type FlussPhaseType = new () => FlussBoundPhase;

export type FlussPhaseSource = FlussPhaseData | FlussPhaseType;

export type FlussPhaseDef = {
    src : FlussPhaseSource;
}

// ------------------------------ // -  - // ------------------------------ //

export const isPhaseData = (obj: any): obj is FlussPhaseData => {
    return typeof obj === 'object' && !isPhaseType(obj);
};

export const isPhaseType = (obj: any): obj is FlussPhaseType => {
    return typeof obj === 'function' && !!obj.prototype?.constructor;
}

// ------------------------------ // -  - // ------------------------------ //

export const createPhase = (src : FlussPhaseSource): FlussPhase => {
    if(isPhaseData(src)) {
        return new FlussPhase(src);
    }
    if(isPhaseType(src)) {
        return new src();
    }

    throw new Error(`FlussPhase: Invalid phase definition. Expected FlussPhaseData or FlussPhaseType.`);
}