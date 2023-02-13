import Block from "./block";
import Transaction from "./transaction";
import Slip from "./slip";
import Factory from "./factory";

export default class SaitoFactory implements Factory {
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
