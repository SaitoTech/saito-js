import SharedMethods from "../../shared_methods";
import Saito from "../../saito";

export default class WebSharedMethods implements SharedMethods {
    connectToPeer(peerData: any): void {
        let protocol = "ws";
        if (peerData.protocol === "https") {
            protocol = "wss";
        }
        let url = protocol + "://" + peerData.host + ":" + peerData.port + "/wsopen";

        try {
            console.log("connecting to " + url + "....");
            let socket = new WebSocket(url);
            socket.binaryType = "arraybuffer";
            let index = Saito.getInstance().addNewSocket(socket);

            socket.onmessage = (event: MessageEvent) => {
                // console.log("buffer : ", event.data);
                Saito.getLibInstance().process_msg_buffer_from_peer(new Uint8Array(event.data), index);
            };

            socket.onopen = () => {
                Saito.getLibInstance().process_new_peer(index, peerData);
            };
            socket.onclose = () => {
                Saito.getLibInstance().process_peer_disconnection(index);
            };

            console.log("connected to : " + url + " with peer index : " + index);
        } catch (e) {
            console.error(e);
        }
    }

    disconnectFromPeer(peerIndex: bigint): void {
        Saito.getInstance().removeSocket(peerIndex);
    }

    fetchBlockFromPeer(url: string): Promise<Uint8Array> {
        return fetch(url)
            .then((res: any) => {
                return res.arrayBuffer();
            })
            .then((buffer: ArrayBuffer) => {
                return new Uint8Array(buffer);
            });
    }

    isExistingFile(key: string): boolean {
        try {
            return !!localStorage.getItem(key);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    loadBlockFileList(): Array<string> {
        try {
            // console.log("loading block file list...");
            // let files = Object.keys(localStorage);
            // console.log("files : ", files);
            // return files;
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    readValue(key: string): Uint8Array | null {
        try {
            let data = localStorage.getItem(key);
            if (!data) {
                console.log("item not found for key : " + key);
                return null;
            }
            let buffer = Buffer.from(data, "base64");
            return new Uint8Array(buffer);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    removeValue(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(e);
        }
    }

    sendMessage(peerIndex: bigint, buffer: Uint8Array): void {
        let socket = Saito.getInstance().getSocket(peerIndex);
        socket.send(buffer);
        
    }

    sendMessageToAll(buffer: Uint8Array, exceptions: Array<bigint>): void {
        Saito.getInstance().sockets.forEach((socket, key) => {
            if (exceptions.includes(key)) {
                return;
            }
            socket.send(buffer);
        });
    }

    writeValue(key: string, value: Uint8Array): void {
        try {
            localStorage.setItem(key, Buffer.from(value).toString("base64"));
        } catch (error) {
            console.error(error);
        }
    }

}
