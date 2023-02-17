import Saito from './saito';
import SharedMethods from "./shared_methods";
import Configs from "./configs";

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

    return Saito.initialize(configs, sharedMethods);
}

export default Saito;
