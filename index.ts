import Configs from "./configs";
import SharedMethods from "./shared_methods";
import Factory from "./lib/factory";

export async function initialize(
  configs: Configs,
  sharedMethods: SharedMethods,
  factory: Factory,
  privateKey: string
) {
  if (typeof window === "undefined") {
    const saito = await import("./index.node");
    return saito.default.initialize(configs, sharedMethods, factory, privateKey);
  } else {
    const saito = await import("./index.web");
    return saito.default.initialize(configs, sharedMethods, factory, privateKey);
  }
}
