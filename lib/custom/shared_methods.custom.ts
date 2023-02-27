import SharedMethods from "../../shared_methods";
import Saito from "../../saito";

export default class CustomSharedMethods implements SharedMethods {
    processApiCall(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }

    connectToPeer(peerData: any): void {
        throw new Error("Method not implemented.");
    }

    disconnectFromPeer(peerIndex: bigint): void {
        throw new Error("Method not implemented.");
    }

    fetchBlockFromPeer(url: string): Promise<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    isExistingFile(key: string): boolean {
        throw new Error("Method not implemented.");
    }

    loadBlockFileList(): Array<string> {
        throw new Error("Method not implemented.");
    }


    processApiError(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): void {
        let promise = Saito.getInstance().promises.get(msgIndex);
        if (promise) {
            promise.reject(buffer);
        } else {
            console.error("callback not found for callback index : " + msgIndex + " from peer : " + peerIndex);
        }
    }

    processApiResult(buffer: Uint8Array, msgIndex: number, peerIndex: bigint): void {
        let promise = Saito.getInstance().promises.get(msgIndex);
        if (promise) {
            promise.resolve(buffer);
        } else {
            console.error("callback not found for callback index : " + msgIndex + " from peer : " + peerIndex);
        }
    }

    readValue(key: string): Uint8Array | null {
        throw new Error("Method not implemented.");
    }

    removeValue(key: string): void {
        throw new Error("Method not implemented.");
    }

    sendMessage(peerIndex: bigint, buffer: Uint8Array): void {
        throw new Error("Method not implemented.");
    }

    sendMessageToAll(buffer: Uint8Array, exceptions: Array<bigint>): void {
        throw new Error("Method not implemented.");
    }

    writeValue(key: string, value: Uint8Array): void {
        throw new Error("Method not implemented.");
    }

}
