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
import PeerServiceList from "./lib/peer_service_list";

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

  return import("saito-wasm/pkg/web")
    .then((s: any) => {
      return s.default().then(() => {
        return s;
      });
    })
    .then((s) => {
      Saito.setLibInstance(s);

      Transaction.Type = s.WasmTransaction;
      Slip.Type = s.WasmSlip;
      Block.Type = s.WasmBlock;
      Peer.Type = s.WasmPeer;
      Wallet.Type = s.WasmWallet;
      Blockchain.Type = s.WasmBlockchain;
      PeerService.Type = s.WasmPeerService;
      PeerServiceList.Type = s.WasmPeerServiceList;

      console.log("init output = ", s);
      Saito.setWasmMemory(s.memory);

      return Saito.initialize(configs, sharedMethods, factory, privateKey);
    });
}

export default Saito;
