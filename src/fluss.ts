import { FlussStageBundle } from "./flussStage";

class Fluss {
    #stageBundle : FlussStageBundle;

    constructor(stageBundle: FlussStageBundle) {
        this.#stageBundle = stageBundle;
    }
}

export default Fluss;