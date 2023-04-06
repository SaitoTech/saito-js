import SharedMethods from "./shared_methods";
import Transaction from "./lib/transaction";
import Block from "./lib/block";
import Factory from "./lib/factory";
import Peer from "./lib/peer";

// export enum MessageType {
//     HandshakeChallenge = 1,
//     HandshakeResponse,
//     //HandshakeCompletion,
//     ApplicationMessage = 4,
//     Block,
//     Transaction,
//     BlockchainRequest,
//     BlockHeaderHash,
//     Ping,
//     SPVChain,
//     Services,
//     GhostChain,
//     GhostChainRequest,
//     Result,
//     Error,
//     ApplicationTransaction,
// }

export default class Saito {
    private static instance: Saito;
    private static libInstance: any;
    sockets: Map<bigint, any> = new Map<bigint, any>();
    nextIndex: bigint = BigInt(0);
    factory = new Factory();
    promises = new Map<number, any>();
    private callbackIndex: number = 1;


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
            },
            process_api_call: (buffer: Uint8Array, msgIndex: number, peerIndex: bigint) => {
                return sharedMethods.processApiCall(buffer, msgIndex, peerIndex).then(() => {

                });
            },
            process_api_success: (buffer: Uint8Array, msgIndex: number, peerIndex: bigint) => {
                return sharedMethods.processApiSuccess(buffer, msgIndex, peerIndex);
            },
            process_api_error: (buffer: Uint8Array, msgIndex: number, peerIndex: bigint) => {
                return sharedMethods.processApiError(buffer, msgIndex, peerIndex);
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

    public async getLatestBlockHash(): Promise<string> {
        return Saito.getLibInstance().get_latest_block_hash();
    }

    public async getBlock<B extends Block>(blockHash: string): Promise<B> {
        let block = await Saito.getLibInstance().get_block(blockHash);
        return Saito.getInstance().factory.createBlock(block) as B;
    }

    public async getPublicKey(): Promise<string> {
        return Saito.getLibInstance().get_public_key();
    }

    public async getPrivateKey(): Promise<string> {
        return Saito.getLibInstance().get_private_key();
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
        let wasmTx = await Saito.getLibInstance().create_transaction(publickey, amount, fee, force_merge);
        return Saito.getInstance().factory.createTransaction(wasmTx) as T;
    }

    public async signTransaction(tx: Transaction): Promise<Transaction> {
        tx.packData();
        await tx.wasmTransaction.sign();
        return tx;
    }

    public async getPendingTransactions<Tx extends Transaction>(): Promise<Array<Tx>> {
        let txs = await Saito.getLibInstance().get_pending_txs();
        return txs.map((tx: any) => Saito.getInstance().factory.createTransaction(tx));
    }

    public async signAndEncryptTransaction(tx: Transaction) {
        return tx.wasmTransaction.sign_and_encrypt();
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


    public async getPeer(index: bigint): Promise<Peer> {
        let peer = await Saito.getLibInstance().get_peer(index);
        return this.factory.createPeer(peer);
    }

    public generatePrivateKey(): string {
        return Saito.getLibInstance().generate_private_key();
    }

    public generatePublicKey(privateKey: string): string {
        return Saito.getLibInstance().generate_public_key(privateKey);
    }

    public async propagateTransaction(tx: Transaction) {
        return Saito.getLibInstance().propagate_transaction(tx.wasmTransaction);
    }

    public async sendApiCall(buffer: Uint8Array, peerIndex: bigint, waitForReply: boolean): Promise<Uint8Array> {
        console.log("saito.sendApiCall : peer = " + peerIndex);
        let callbackIndex = this.callbackIndex++;
        if (waitForReply) {

            return new Promise((resolve, reject) => {
                this.promises.set(callbackIndex, {
                    resolve,
                    reject
                });
                Saito.getLibInstance().send_api_call(buffer, callbackIndex, peerIndex);
            });
        } else {
            return Saito.getLibInstance().send_api_call(buffer, callbackIndex, peerIndex);
        }
    }

    public async sendApiSuccess(msgId: number, buffer: Uint8Array, peerIndex: bigint) {
        await Saito.getLibInstance().send_api_success(buffer, msgId, peerIndex);
        // let socket = this.getSocket(peerIndex);
        // const data = new ApiMessage(buffer, msgId).serialize();
        // socket.send(data);
    }

    public async sendApiError(msgId: number, buffer: Uint8Array, peerIndex: bigint) {
        await Saito.getLibInstance().send_api_error(buffer, msgId, peerIndex);
    }

    public async sendTransactionWithCallback(transaction: Transaction, callback?: any, peerIndex?: bigint): Promise<any> {
        // TODO : implement retry on fail
        // TODO : stun code goes here probably???
        console.log("saito.sendTransactionWithCallback : peer = " + peerIndex + " sig = " + transaction.signature);
        let buffer = transaction.wasmTransaction.serialize();
        console.log("sendTransactionWithCallback : " + peerIndex + " with length : " + buffer.byteLength + " sent : ", transaction.msg);
        await this.sendApiCall(buffer, peerIndex || BigInt(0), !!callback)
            .then((buffer: Uint8Array) => {
                if (callback) {
                    let tx = Transaction.deserialize(buffer, this.factory);
                    console.log("sendTransactionWithCallback received : ", tx);
                    return callback(tx.data);
                }
            })
            .catch((error) => {
                console.error(error);
                if (callback) {
                    return callback({err: error.toString()});
                }
            });
    }

    public async propagateServices(peerIndex: bigint, services: string[]) {
        return Saito.getLibInstance().propagateServices(peerIndex, services);
    }

    public async sendRequest(message: string, data: any = "", callback?: any, peerIndex?: bigint): Promise<any> {
        console.log("saito.sendRequest : peer = " + peerIndex);
        let publicKey = await this.getPublicKey();
        let tx = await this.createTransaction(publicKey, BigInt(0), BigInt(0));
        tx.msg = {
            request: message,
            data: data,
        };
        tx.packData();
        return this.sendTransactionWithCallback(tx, callback, peerIndex);
    }
}
