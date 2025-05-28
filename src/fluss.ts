import { FlussStageDef } from "./flussStage";

class Fluss {
    #data : FlussData;

    constructor(data: FlussData) {
        this.#data = data;
    }

    // ------------------------- // -  - // ------------------------- //

    public static create(data: FlussData) : Fluss {
        return new Fluss(data);
    }
}

export default Fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussData = {
    [key: string]: FlussStageDef;
}