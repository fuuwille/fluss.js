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

export type FlussDataStages = {
    [key: string]: FlussStageDef;
}

// ------------------------------ // -  - // ------------------------------ //

export const createFluss = (data: FlussData): Fluss => {
    return new Fluss(data);
}