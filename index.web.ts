import Saito from './saito';
import SharedMethods from "./shared_methods";
import Configs from "./configs";
import Transaction from "./lib/transaction";
import Slip from "./lib/slip";
import Block from "./lib/block";
import Peer from "./lib/peer";
import Factory from "./lib/factory";

/**
 *
 * @param configs
 * @param sharedMethods
 */
export async function initialize(configs: Configs, sharedMethods: SharedMethods, factory: Factory) {
    if (Saito.getLibInstance()) {
        console.error("saito already initialized");
        return;
    }
    console.log("initializing saito-js");

    return import("saito-wasm/dist/browser")
        .then((s: any) => {
            return s.default;
        })
        .then((s) => {
            Saito.setLibInstance(s);
            return s.default()
                .then(() => {

                    Transaction.Type = s.WasmTransaction;
                    Slip.Type = s.WasmSlip;
                    Block.Type = s.WasmBlock;
                    Peer.Type = s.WasmPeer;
                    return Saito.initialize(configs, sharedMethods, factory);
                });
        });
}


export default Saito;
