import Saito from './saito';
import SharedMethods from "./shared_methods";
import Configs from "./configs";
import Transaction from "./lib/transaction";
import Slip from "./lib/slip";
import Block from "./lib/block";
import Peer from "./lib/peer";

let cr = require('crypto');
globalThis.crypto = cr.webcrypto;


/**
 *
 * @param configs
 * @param sharedMethods
 */
export async function initialize(configs: Configs, sharedMethods: SharedMethods) {
    if (Saito.getLibInstance()) {
        console.error("saito already initialized");
        return;
    }
    console.log("initializing saito-js");
    let saito = await import("saito-wasm/dist/server");
    console.log("wasm lib loaded");

    let s = await saito.default;

    Saito.setLibInstance(s);

    console.log("WasmTransaction", s.WasmTransaction);
    Transaction.Type = s.WasmTransaction;
    Slip.Type = s.WasmSlip;
    Block.Type = s.WasmBlock;
    Peer.Type = s.WasmPeer;

    return Saito.initialize(configs, sharedMethods);
}

export default Saito;
