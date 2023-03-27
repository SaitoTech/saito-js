import type {WasmPeer} from "saito-wasm/dist/types/pkg/node/index_bg";

export default class Peer {
    private peer: WasmPeer;
    public static Type: any;

    constructor(peer?: WasmPeer, peerIndex?: bigint) {
        if (peer) {
            this.peer = peer;
        } else {
            this.peer = new Peer.Type(peerIndex);
        }
    }

    public get publicKey(): string {
        return this.peer.public_key;
    }

    // public set publicKey(key: string) {
    //     this.peer.public_key = key;
    // }

    public get keyList(): Array<string> {
        return this.peer.key_list;
    }

    public get peerIndex(): bigint {
        return this.peer.peer_index;
    }
}
