import Wallet from "./lib/wallet";
import Blockchain from "./lib/blockchain";
import type { WasmPeerService } from "saito-wasm/dist/types/pkg/node/index_bg";

export default interface SharedMethods {
  sendMessage(peerIndex: bigint, buffer: Uint8Array): void;

  sendMessageToAll(buffer: Uint8Array, exceptions: Array<bigint>): void;

  connectToPeer(peerData: any): void;

  writeValue(key: string, value: Uint8Array): void;

  readValue(key: string): Uint8Array | null;

  loadBlockFileList(): Array<string>;

  isExistingFile(key: string): boolean;

  removeValue(key: string): void;

  disconnectFromPeer(peerIndex: bigint): void;

  fetchBlockFromPeer(url: string): Promise<Uint8Array>;

  processApiCall(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): Promise<void>;

  processApiSuccess(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): void;

  processApiError(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): void;

  sendInterfaceEvent(event: String, peerIndex: bigint): void;

  saveWallet(wallet: Wallet): void;

  loadWallet(wallet: Wallet): void;

  saveBlockchain(blockchain: Blockchain): void;

  loadBlockchain(blockchain: Blockchain): void;

  getMyServices(): Array<WasmPeerService>;
}
