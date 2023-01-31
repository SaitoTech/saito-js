import Saito from './saito';
import SharedMethods from "./shared_methods";

// let cr = require('crypto');
// globalThis.crypto = cr.webcrypto;

// let configs = {
//     "server": {
//         "host": "127.0.0.1",
//         "port": 13201,
//         "protocol": "http",
//         "endpoint": {
//             "host": "127.0.0.1",
//             "port": 13201,
//             "protocol": "http"
//         },
//         "verification_threads": 1,
//         "channel_size": 10000,
//         "stat_timer_in_ms": 5000,
//         "thread_sleep_time_in_ms": 10,
//         "block_fetch_batch_size": 10
//     },
//     "peers": [
//         {
//             "host": "127.0.0.1",
//             "port": 12101,
//             "protocol": "http",
//             "synctype": "full"
//         }
//     ]
// };

/**
 *
 * @param configs
 * @param sharedMethods
 */
export async function initialize(configs: any, sharedMethods: SharedMethods) {
    return import("saito-wasm/dist/browser")
        .then((s: any) => {
            return s.default;
        })
        .then((s) => {
            Saito.setLibInstance(s);

            return Saito.initialize(configs, sharedMethods);
        });

}

export default Saito;