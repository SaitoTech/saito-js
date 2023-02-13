import Block from "./block";
import Transaction from "./transaction";
import Slip from "./slip";


export default interface Factory {
    createBlock(data: any): Block;

    createTransaction(data: any): Transaction;

    createSlip(data: any): Slip;
}
