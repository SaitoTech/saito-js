import SharedMethods from "./shared_methods";
import Transaction from "./lib/transaction";
import Block from "./lib/block";
import Factory from "./lib/factory";
import Peer from "./lib/peer";

export default class Saito {
    private static instance: Saito;
    private static libInstance: any;
    sockets: Map<bigint, any> = new Map<bigint, any>();
    nextIndex: bigint = BigInt(0);
    factory = new Factory();

    public static async initialize(configs: any, sharedMethods: SharedMethods, factory = new Factory()) {
        this.instance = new Saito(factory);

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

        await Saito.getLibInstance().initialize(JSON.stringify(configs));
        console.log("saito initialized");

        setInterval(() => {
            Saito.getLibInstance().process_timer_event(BigInt(100));
            // console.log(`WASM memory usage is ${wasm.memory.buffer.byteLength} bytes`);
        }, 100);
    }

    constructor(factory: Factory) {
        this.factory = factory;
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

    public async initialize(configs: any): Promise<any> {
        return Saito.getLibInstance().initialize(configs);
    }


    public async sendTransaction(transaction: Transaction): Promise<any> {
        return Saito.getLibInstance().send_transaction(transaction.wasmTransaction);
    }

    public getLatestBlockHash(): string {
        return Saito.getLibInstance().get_latest_block_hash();
    }

    public async getBlock<B extends Block>(blockHash: string): Promise<B> {
        let block = await Saito.getLibInstance().get_block(blockHash);
        return Saito.getInstance().factory.createBlock(block) as B;
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

    public hash(buffer: Uint8Array): string {
        return Saito.getLibInstance().hash(buffer);
    }

    public signBuffer(buffer: Uint8Array, privateKey: String): string {
        return Saito.getLibInstance().sign_buffer(buffer, privateKey);
    }

    public verifySignature(buffer: Uint8Array, signature: string, publicKey: string): boolean {
        return Saito.getLibInstance().verify_signature(buffer, signature, publicKey);
    }

    public async createTransaction<T extends Transaction>(
        publickey = "",
        amount = BigInt(0),
        fee = BigInt(0),
        force_merge = false
    ): Promise<T> {
        let wasmTx = await Saito.getLibInstance().create_transaction(publickey, amount, amount, fee, force_merge);
        return Saito.getInstance().factory.createTransaction(wasmTx) as T;
    }

    public async signTransaction(tx: Transaction) {
        await tx.wasmTransaction.sign();
    }


    public async getPendingTransactions<Tx extends Transaction>(): Promise<Array<Tx>> {
        return Saito.getLibInstance().get_pending_txs();
    }

    public async signAndEncryptTransaction(tx: Transaction) {
        await tx.wasmTransaction.sign_and_encrypt();
    }

    public async getBalance(): Promise<bigint> {
        return Saito.getLibInstance().get_balance();
    }

    public async getPeers(): Promise<Array<Peer>> {
        let peers = await Saito.getLibInstance().get_peers();
        return peers.map((peer: any) => {
            return this.factory.createPeer(peer);
        });
    }
}
