import Block from "./block";
import Transaction from "./transaction";
import Slip from "./slip";

export default class Factory {
    public createBlock(data: any): Block {
        return new Block(data);
    }

    public createTransaction(data: any): Transaction {
        return new Transaction(data);
    }

    public createSlip(data: any): Slip {
        return new Slip(data);
    }
}

class S extends Slip {

}

class F extends Factory {
    createSlip(data: any): Slip {
        return new S(data);
    }
}
