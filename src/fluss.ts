import { FlussStageBundle, FlussStageData } from "./flussStage";

class Fluss {
    #config : FlussConfig;

    constructor(config: FlussConfig) {
        this.#config = config;
    }
}

export default Fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussConfig = {
    stages: FlussStageBundle;
}

export type FlussContent = {
    [key: string]: FlussStageData;
}