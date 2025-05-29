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
    stages : FlussDataStages;
}

export type FlussDataStages = {
    [key: string] : FlussStageDef;
}

// ------------------------------ // -  - // ------------------------------ //

export const createFluss = (data: FlussData): Fluss => {
    return new Fluss(data);
}

export const defineFluss = (stages: FlussDataStages): FlussData => {
    return {
        stages
    };
}