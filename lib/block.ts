import type {WasmBlock} from 'saito-wasm/dist/types/pkg/node/index_bg';
import Transaction from "./transaction";
import Slip from "./slip";
import Saito from "../saito";

export enum BlockType {
    Ghost = 0,
    Header = 1,
    Pruned = 2,
    Full = 3,
}


export default class Block<Tx extends Transaction<Slip> = Transaction> {
    private block: WasmBlock;

    constructor(block: WasmBlock) {
        this.block = block;
    }

    public get transactions(): Array<Tx> {
        return this.block.transactions.map(tx => {
            return Saito.getInstance().factory.createTransaction(tx) as Tx;
        });
    }

}
