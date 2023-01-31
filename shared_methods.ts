export default interface SharedMethods {
    sendMessage(peerIndex: bigint, buffer: Uint8Array): void;

    sendMessageToAll(buffer: Uint8Array, exceptions: Array<bigint>): void;

    connectToPeer(peerData: any): void;

    writeValue(key: string, value: Uint8Array): void;

    readValue(key: string): Uint8Array | null;

    loadBlockFileList(): Array<string>;

    isExistingFile(key: string): boolean;

    removeValue(key: string): void;

    disconnectFromPeer(peerIndex: bigint): void;

    fetchBlockFromPeer(url: string): Promise<Uint8Array>;
}
