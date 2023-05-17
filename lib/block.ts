import type { WasmBlock } from "saito-wasm/dist/types/pkg/node/index_bg";
import Transaction from "./transaction";
import Saito from "../saito";
import WasmWrapper from "./wasm_wrapper";

export enum BlockType {
  Ghost = 0,
  Header = 1,
  Pruned = 2,
  Full = 3,
}

export default class Block extends WasmWrapper<WasmBlock> {
  public static Type: any;

  constructor(block?: WasmBlock) {
    if (!block) {
      block = Block.Type();
    }
    super(block!);
  }

  public get transactions(): Array<Transaction> {
    return this.instance.transactions.map((tx) => {
      return Saito.getInstance().factory.createTransaction(tx);
    });
  }

  public get id(): bigint {
    return this.instance.id;
  }

  public get hash(): string {
    return this.instance.hash;
  }

  public serialize(): Uint8Array {
    return this.instance.serialize();
  }
}
