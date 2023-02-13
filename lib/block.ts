import type {WasmBlock} from 'saito-wasm/dist/types/pkg/node/index_bg';

export default class Block {
    private block: WasmBlock;

    constructor(block: WasmBlock) {
        this.block = block;
    }
}
