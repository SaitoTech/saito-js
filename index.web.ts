import Saito from './saito';
import SharedMethods from "./shared_methods";

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
    if (Saito.getLibInstance()) {
        console.error("saito already initialized");
        return;
    }
    console.log("initializing saito-js");

    return import("saito-wasm/dist/browser")
        .then((s: any) => {
            // console.log("s : ", s);
            // console.log("m1 : ", s.memory);
            return s.default;
        })
        // .then((s) => {
        //     console.log("s2 : ", s);
        //     console.log("m2 : ", s.memory);
        //     return s.default();
        // })
        .then((s) => {
            // console.log("s3 : ", s);
            // console.log("m3 : ", s.memory);
            // console.log("configs : ", configs);
            Saito.setLibInstance(s);

            return s.default()
                .then(() => {
                    return Saito.initialize(configs, sharedMethods);
                    // return Saito.getLibInstance().test_run("aaaa");
                });

            // return Saito.initialize(configs, sharedMethods);
        });
}

export default Saito;
