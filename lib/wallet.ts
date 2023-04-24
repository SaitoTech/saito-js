import type {WasmWallet} from "saito-wasm/dist/types/pkg/node/index_bg";
import Saito from "../saito";

export default class Wallet {
    protected wallet: WasmWallet;
    public static Type: any;

    constructor(wallet: WasmWallet) {
        this.wallet = wallet;
    }

    public async save() {
        return this.wallet.save();
    }

    public async load() {
        return this.wallet.load();
    }

    public async reset() {
        return this.wallet.reset();
    }

    public async getPublicKey() {
        return this.wallet.get_public_key();
    }

    public async getPrivateKey() {
        return this.wallet.get_private_key();
    }

    public async getBalance() {
        return this.wallet.get_balance();
    }

    public async getPendingTxs() {
        let txs = await this.wallet.get_pending_txs();
        return txs.map((tx: any) => Saito.getInstance().factory.createTransaction(tx));
    }
}
