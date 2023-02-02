import SharedMethods from "./shared_methods";
import type {WasmTransaction} from 'saito-wasm/dist/types/pkg/node/index_bg';

export default class Saito {
    private static instance: Saito;
    private static libInstance: any;
    sockets: Map<bigint, any> = new Map<bigint, any>();
    nextIndex: bigint = BigInt(0);


    public static async initialize(configs: any, sharedMethods: SharedMethods) {
        this.instance = new Saito();

        // @ts-ignore
        globalThis.shared_methods = {
            send_message: (peer_index: bigint, buffer: Uint8Array) => {
                sharedMethods.sendMessage(peer_index, buffer);
            },
            send_message_to_all: (buffer: Uint8Array, exceptions: Array<bigint>) => {
                sharedMethods.sendMessageToAll(buffer, exceptions);
            },
            connect_to_peer: (peer_data: any) => {
                sharedMethods.connectToPeer(peer_data);
            },
            write_value: (key: string, value: Uint8Array) => {
                return sharedMethods.writeValue(key, value);
            },
            read_value: (key: string) => {
                return sharedMethods.readValue(key);
            },
            load_block_file_list: () => {
                return sharedMethods.loadBlockFileList();
            },
            is_existing_file: (key: string) => {
                return sharedMethods.isExistingFile(key);
            },
            remove_value: (key: string) => {
                return sharedMethods.removeValue(key);
            },
            disconnect_from_peer: (peer_index: bigint) => {
                return sharedMethods.disconnectFromPeer(peer_index);
            },
            fetch_block_from_peer: (hash: Uint8Array, peer_index: bigint, url: string) => {
                console.log("fetching block : " + url);
                sharedMethods.fetchBlockFromPeer(url).then((buffer: Uint8Array) => {
                    Saito.getLibInstance().process_fetched_block(buffer, hash, peer_index);
                })
            }
        };

        await Saito.getLibInstance().initialize(configs);
        console.log("saito initialized");

        setInterval(() => {
            Saito.getLibInstance().process_timer_event(BigInt(100));
        }, 100);
    }

    public static getInstance(): Saito {
        return Saito.instance;
    }

    public static getLibInstance(): any {
        return Saito.libInstance;
    }

    public static setLibInstance(instance: any) {
        Saito.libInstance = instance;
    }

    public addNewSocket(socket: any): bigint {
        this.nextIndex++;
        this.sockets.set(this.nextIndex, socket);
        return this.nextIndex;
    }

    public getSocket(index: bigint): any | null {
        return this.sockets.get(index);
    }

    public removeSocket(index: bigint) {
        let socket = this.sockets.get(index);
        this.sockets.delete(index);
        socket.close();
    }

    public async setConfigs(json: any): Promise<void> {
        return Saito.getLibInstance().set_configs(json);
    }

    public async initialize(configs: any): Promise<any> {
        return Saito.getLibInstance().initialize(configs);
    }

    public async createTransaction(): Promise<WasmTransaction> {
        return Saito.getLibInstance().create_transaction();
    }

    public async sendTransaction(transaction: WasmTransaction): Promise<any> {
        return Saito.getLibInstance().send_transaction(transaction);
    }

    public getLatestBlockHash(): string {
        return Saito.getLibInstance().get_latest_block_hash();
    }

    public getPublicKey(): string {
        return Saito.getLibInstance().get_public_key();
    }

    public async processNewPeer(index: bigint, peer_config: any): Promise<void> {
        return Saito.getLibInstance().process_new_peer(index, peer_config);
    }

    public async processPeerDisconnection(peer_index: bigint): Promise<void> {
        return Saito.getLibInstance().process_peer_disconnection(peer_index);
    }

    public async processMsgBufferFromPeer(buffer: Uint8Array, peer_index: bigint): Promise<void> {
        return Saito.getLibInstance().process_msg_buffer_from_peer(buffer, peer_index);
    }

    public async processFetchedBlock(buffer: Uint8Array, hash: Uint8Array, peer_index: bigint): Promise<void> {
        return Saito.getLibInstance().process_fetched_block(buffer, hash, peer_index);
    }

    public async processTimerEvent(duration_in_ms: bigint): Promise<void> {
        return Saito.getLibInstance().process_timer_event(duration_in_ms);
    }
}
