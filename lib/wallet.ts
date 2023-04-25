import type { WasmWallet } from "saito-wasm/dist/types/pkg/node/index_bg";
import Saito from "../saito";

export const DefaultEmptyPrivateKey =
  "0000000000000000000000000000000000000000000000000000000000000000";
export const DefaultEmptyPublicKey =
  "000000000000000000000000000000000000000000000000000000000000000000";

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
    let key = await this.wallet.get_public_key();
    return key === DefaultEmptyPublicKey ? "" : key;
  }

  public async setPublicKey(key: string) {
    if (key === "") {
      key = DefaultEmptyPublicKey;
    }
    return this.wallet.set_public_key(key);
  }

  public async getPrivateKey() {
    let key = await this.wallet.get_private_key();
    return key === DefaultEmptyPrivateKey ? "" : key;
  }

  public async setPrivateKey(key: string) {
    if (key === "") {
      key = DefaultEmptyPrivateKey;
    }
    return this.wallet.set_private_key(key);
  }

  public async getBalance() {
    return this.wallet.get_balance();
  }

  public async getPendingTxs() {
    let txs = await this.wallet.get_pending_txs();
    return txs.map((tx: any) => Saito.getInstance().factory.createTransaction(tx));
  }
}
