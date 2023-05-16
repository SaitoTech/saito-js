import type { WasmPeer } from "saito-wasm/dist/types/pkg/node/index_bg";

export default class Peer {
  protected peer: WasmPeer;
  public static Type: any;

  constructor(peer?: WasmPeer, peerIndex?: bigint) {
    if (peer) {
      this.peer = peer;
    } else {
      this.peer = new Peer.Type(peerIndex);
    }
  }

  public free() {
    this.peer.free();
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

  public get synctype(): string {
    return this.peer.sync_type;
  }

  public get services(): string[] {
    return this.peer.services;
  }

  public set services(s: string[]) {
    this.peer.services = s;
  }

  public hasService(service: string): boolean {
    return this.peer.has_service(service);
  }

  public isMainPeer(): boolean {
    return this.peer.is_main_peer();
  }
}
