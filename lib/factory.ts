import Block from "./block";
import Slip from "./slip";
import Transaction from "./transaction";


export default interface Factory {
    createBlock(data: any): Block;

    createTransaction(data: any): Transaction;

    createSlip(data: any): Slip;
}
