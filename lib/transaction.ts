import type {WasmTransaction} from "saito-wasm/dist/types/pkg/node/index_bg";
import Slip from "./slip";
import Saito from "../saito";
import Factory from "./factory";

export enum TransactionType {
    Normal = 0,
    Fee = 1,
    GoldenTicket = 2,
    ATR = 3,
    Vip = 4,
    SPV = 5,
    Issuance = 6,
    Other = 7,
}

export default class Transaction {
    protected tx: WasmTransaction;
    public static Type: any;
    public msg: any = {};

    // TODO : factory pattern might be useful here to remove unnecessary wrappings
    constructor(tx?: WasmTransaction, json?: any) {
        if (tx) {
            this.tx = tx;
        } else {
            this.tx = new Transaction.Type();
        }
        if (json) {
            for (let slip of json.to) {
                let s = new Slip(undefined, slip);
                this.addToSlip(s);
            }
            for (let slip of json.from) {
                let s = new Slip(undefined, slip);
                this.addFromSlip(s);
            }
            this.timestamp = json.timestamp;
            this.type = json.type;
            this.signature = json.signature;
            this.data = new Uint8Array(Buffer.from(json.buffer, "base64"));
            this.txs_replacements = json.txs_replacements;
        }
    }

    public get wasmTransaction(): WasmTransaction {
        return this.tx;
    }

    public addFromSlip(slip: Slip) {
        this.tx.add_from_slip(slip.wasmSlip);
    }

    public addToSlip(slip: Slip) {
        this.tx.add_to_slip(slip.wasmSlip);
    }

    public get to(): Array<Slip> {
        return this.tx.to.map((slip) => {
            return Saito.getInstance().factory.createSlip(slip);
        });
    }

    public get from(): Array<Slip> {
        return this.tx.from.map((slip) => {
            return Saito.getInstance().factory.createSlip(slip);
        });
    }

    public get type(): TransactionType {
        return this.tx.type as TransactionType;
    }

    public set type(type: TransactionType) {
        this.tx.type = type as number;
    }

    public get timestamp(): number {
        return Number(this.tx.timestamp);
    }

    public set timestamp(timestamp: bigint | number) {
        this.tx.timestamp = BigInt(timestamp);
    }

    public set signature(sig: string) {
        this.tx.signature = sig;
    }

    public get signature(): string {
        return this.tx.signature;
    }

    public set data(buffer: Uint8Array) {
        this.tx.data = buffer;
    }

    public get data(): Uint8Array {
        return this.tx.data;
    }

    public set txs_replacements(r: number) {
        this.tx.txs_replacements = r;
    }

    public get txs_replacements(): number {
        return this.tx.txs_replacements;
    }

    public get total_fees(): bigint {
        return this.tx.total_fees;
    }

    public async sign() {
        return this.tx.sign();
    }

    public async signAndEncrypt() {
        return this.tx.sign_and_encrypt();
    }

    public isFrom(key: string): boolean {
        return this.tx.is_from(key);
    }

    public isTo(key: string): boolean {
        return this.tx.is_to(key);
    }

    public toJson() {
        this.packData();
        return {
            to: this.to.map((slip) => slip.toJson()),
            from: this.from.map((slip) => slip.toJson()),
            type: this.type,
            timestamp: this.timestamp,
            signature: this.signature,
            buffer: Buffer.from(this.data).toString("base64"),
            txs_replacements: this.txs_replacements,
            total_fees: this.total_fees,
        };
    }

    public static deserialize(buffer: Uint8Array, factory: Factory): Transaction | null {
        try {
            let wasmTx = Transaction.Type.deserialize(buffer);
            return factory.createTransaction(wasmTx);
        } catch (e) {
            console.debug(e);
            return null;
        }
    }

    public serialize(): Uint8Array {
        return this.tx.serialize();
    }

    public packData() {
        if (Object.keys(this.msg).length === 0) {
            this.data = new Uint8Array(Buffer.alloc(0));
        } else {
            this.data = new Uint8Array(Buffer.from(JSON.stringify(this.msg), "utf-8"));
        }
    }

    public unpackData() {
        if (this.data.byteLength === 0) {
            this.msg = {};
        } else {
            try {
                this.msg = JSON.parse(Buffer.from(this.data).toString("utf-8"));
            } catch (error) {
                console.log("failed parsing tx buffer into msg");
                console.error(error);
                this.msg = {};
            }
        }
    }
}
