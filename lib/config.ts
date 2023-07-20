// import type { WasmConfiguration } from "saito-wasm/pkg/node/index";
// import WasmWrapper from "./wasm_wrapper";
//
// export default class Config extends WasmWrapper<WasmConfiguration> {
//   public static Type: any;
//   server: {
//     host: string;
//     port: number;
//     protocol: string;
//     endpoint: {
//       host: string;
//       port: number;
//       protocol: string;
//     };
//     verification_threads: number;
//     channel_size: number;
//     stat_timer_in_ms: number;
//     reconnection_wait_time: number;
//     thread_sleep_time_in_ms: number;
//     block_fetch_batch_size: number;
//   } = {
//     host: "localhost",
//     port: 12101,
//     protocol: "http",
//     endpoint: {
//       host: "localhost",
//       port: 12101,
//       protocol: "http",
//     },
//     verification_threads: 4,
//     channel_size: 10000,
//     stat_timer_in_ms: 5000,
//     reconnection_wait_time: 10000,
//     thread_sleep_time_in_ms: 10,
//     block_fetch_batch_size: 10,
//   };
//   peers: {
//     host: string;
//     port: number;
//     protocol: string;
//     synctype: string;
//   }[] = [];
//   spv_mode: boolean = false;
//   browser_mode: boolean = false;
//
//   constructor() {
//     super(new Config.Type());
//   }
// }
