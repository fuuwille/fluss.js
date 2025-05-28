import { FlussStageDef } from "./flussStage";

class Fluss {
    #data : FlussData;

    constructor(data?: FlussData) {     
        if(!data) {
            if(this.bind) {
                data = this.bind();
            }
            else {
                throw new Error("Fluss: No stage definitions provided.");
            }
        }

        this.#data = data;
    }

    protected bind?() : FlussData;

    // ------------------------- // -  - // ------------------------- //

    public static create(data: FlussData) : Fluss {
        return new Fluss(data);
    }
}

export abstract class FlussBound extends Fluss {
    constructor() {
        super();
    }

    protected bind(): FlussData {
        return this.data();
    }

    // ------------------------- // -  - // ------------------------- //

    public abstract data() : FlussData;
}


export default Fluss;

// ------------------------------ // -  - // ------------------------------ //

export type FlussData = {
    [key: string]: FlussStageDef;
}