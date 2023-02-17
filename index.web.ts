import Saito from './saito';
import SharedMethods from "./shared_methods";
import Configs from "./configs";

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

    return import("saito-wasm/dist/browser")
        .then((s: any) => {
            return s.default;
        })
        .then((s) => {
            Saito.setLibInstance(s);
            return s.default()
                .then(() => {
                    return Saito.initialize(configs, sharedMethods);
                });
        });
}


export default Saito;
