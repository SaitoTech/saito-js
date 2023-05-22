import WasmWrapper from "./wasm_wrapper";
import { WasmPeerServiceList } from "saito-wasm/dist/types/pkg/node/index_bg";
import PeerService from "./peer_service";

export default class PeerServiceList extends WasmWrapper<WasmPeerServiceList> {
  public static Type: any;

  constructor() {
    super(new PeerServiceList.Type());
  }

  public push(service: PeerService) {
    this.instance.push(service.instance);
  }
}
