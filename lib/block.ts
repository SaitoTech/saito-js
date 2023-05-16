import type { WasmBlock } from "saito-wasm/dist/types/pkg/node/index_bg";
import Transaction from "./transaction";
import Saito from "../saito";

export enum BlockType {
  Ghost = 0,
  Header = 1,
  Pruned = 2,
  Full = 3,
}

export default class Block {
  protected block: WasmBlock;
  public static Type: any;

  constructor(block?: WasmBlock) {
    if (block) {
      this.block = block;
    } else {
      this.block = Block.Type();
    }
  }

  public free() {
    this.block.free();
  }

  public get transactions(): Array<Transaction> {
    return this.block.transactions.map((tx) => {
      return Saito.getInstance().factory.createTransaction(tx);
    });
  }

  public get id(): bigint {
    return this.block.id;
  }

  public get hash(): string {
    return this.block.hash;
  }

  public serialize(): Uint8Array {
    return this.block.serialize();
  }
}
