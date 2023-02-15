import type {WasmSlip, WasmTransaction} from 'saito-wasm/dist/types/pkg/node/index_bg';
import Slip from "./slip";
import Saito from "../saito";

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

export default class Transaction<Sl extends Slip = Slip> {
    private tx: WasmTransaction;

    // TODO : factory pattern might be useful here to remove unnecessary wrappings
    constructor(tx: WasmTransaction) {
        this.tx = tx;
    }

    public get wasmTransaction(): WasmTransaction {
        return this.tx;
    }

    public addFromSlip(slip: Sl) {
        this.tx.add_from_slip(slip.wasmSlip);
    }

    public addToSlip(slip: Sl) {
        this.tx.add_to_slip(slip.wasmSlip);
    }

    public get to(): Array<Sl> {
        let slips: WasmSlip[] = this.tx.output_slips;
        return slips.map(slip => {
            return Saito.getInstance().factory.createSlip(slip) as Sl;
        });
    }

    public get from(): Array<Slip> {
        let slips: WasmSlip[] = this.tx.input_slips;
        return slips.map(slip => {
            return Saito.getInstance().factory.createSlip(slip) as Sl;
        });
    }

    public get type(): TransactionType {
        return this.tx.type as TransactionType;
    }

    public set type(type: TransactionType) {
        this.tx.type = type as number;
    }

    public get timestamp(): bigint {
        return this.tx.timestamp;
    }

    public set timestamp(timestamp: bigint) {
        this.tx.timestamp = timestamp;
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
        await Saito.getInstance().signTransaction(this);
    }
}
