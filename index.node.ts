import Saito from "./saito";
import SharedMethods from "./shared_methods";
import Configs from "./configs";
import Transaction from "./lib/transaction";
import Slip from "./lib/slip";
import Block from "./lib/block";
import Peer from "./lib/peer";
import Factory from "./lib/factory";
import Wallet from "./lib/wallet";
import Blockchain from "./lib/blockchain";
import PeerService from "./lib/peer_service";

const NODE_MAJOR_VERSION = parseInt(process.versions.node.split(".")[0]);
if (NODE_MAJOR_VERSION < 19) {
  let cr = require("crypto");
  globalThis.crypto = cr.webcrypto;
}

/**
 *
 * @param configs
 * @param sharedMethods
 */
export async function initialize(
  configs: Configs,
  sharedMethods: SharedMethods,
  factory: Factory,
  privateKey: string
) {
  if (Saito.getLibInstance()) {
    console.error("saito already initialized");
    return;
  }
  console.log("initializing saito-js");
  let saito = await import("saito-wasm/dist/server");
  console.log("wasm lib loaded");

  let s = await saito.default;

  Saito.setLibInstance(s);

  Transaction.Type = s.WasmTransaction;
  Slip.Type = s.WasmSlip;
  Block.Type = s.WasmBlock;
  Peer.Type = s.WasmPeer;
  Wallet.Type = s.WasmWallet;
  Blockchain.Type = s.WasmBlockchain;
  PeerService.Type = s.WasmPeerService;

  return Saito.initialize(configs, sharedMethods, factory, privateKey);
}

export default Saito;
