import {WasmPeer} from "saito-wasm/dist/types/pkg/node/index_bg";

export default class Peer {
    private peer: WasmPeer;

    constructor(peer: WasmPeer) {
        this.peer = peer;
    }
}
