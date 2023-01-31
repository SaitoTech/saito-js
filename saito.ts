import SharedMethods from "./shared_methods";

export default class Saito {
    static instance: any;
    sockets: Map<bigint, any> = new Map<bigint, any>();
    nextIndex: bigint = BigInt(0);


    public static async initialize(configs: any, sharedMethods: SharedMethods) {

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
                    Saito.getInstance().process_fetched_block(buffer, hash, peer_index);
                })
            }
        };

        await Saito.instance.initialize(configs);
        console.log("saito initialized");

        setInterval(() => {
            Saito.instance.process_timer_event(BigInt(100));
        }, 100);
    }

    public static getInstance(): any {
        return Saito.instance;
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
}
