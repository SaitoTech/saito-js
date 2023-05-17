import type { WasmBlockchain } from "saito-wasm/dist/types/pkg/node/index_bg";
import WasmWrapper from "./wasm_wrapper";

export default class Blockchain extends WasmWrapper<WasmBlockchain> {
  public static Type: any;

  constructor(blockchain: WasmBlockchain) {
    super(blockchain);
  }

  public async reset() {
    return this.instance.reset();
  }
}
