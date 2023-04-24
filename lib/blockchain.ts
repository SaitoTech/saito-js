import type {WasmBlockchain} from "saito-wasm/dist/types/pkg/node/index_bg";

export default class Blockchain {
    protected blockchain: WasmBlockchain;
    public static Type: any;

    constructor(blockchain: WasmBlockchain) {
        this.blockchain = blockchain;
    }

    public async reset() {
        return this.blockchain.reset();
    }
}
