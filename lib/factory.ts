import Block from "./block";
import Transaction from "./transaction";
import Slip from "./slip";
import Peer from "./peer";

export default class Factory {
    constructor() {
    }

    public createBlock(data?: any): Block {
        return new Block(data);
    }

    public createTransaction<T extends Transaction>(data?: any): Transaction {
        return new Transaction(data);
    }

    public createSlip(data?: any): Slip {
        return new Slip(data);
    }

    public createPeer(data?: any): Peer {
        return new Peer(data);
    }
}
