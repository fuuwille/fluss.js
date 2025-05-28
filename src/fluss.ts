import { FlussStageDef } from "./flussStage";

class Fluss {
    #data : FlussData;

    constructor(data: FlussData) {
        this.#data = data;
    }
}

export default Fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussData = {
    [key: string]: FlussStageDef;
}