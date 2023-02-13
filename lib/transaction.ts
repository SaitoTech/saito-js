import type {WasmSlip, WasmTransaction} from 'saito-wasm/dist/types/pkg/node/index_bg';
import Slip from "./slip";

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
    private tx: WasmTransaction;

    // TODO : factory pattern might be useful here to remove unnecessary wrappings
    constructor(tx: WasmTransaction) {
        this.tx = tx;
    }

    public getWasmTransaction(): WasmTransaction {
        return this.tx;
    }

    public getData(): Uint8Array {
        return this.tx.get_data();
    }

    public addInputSlip(slip: Slip) {
        this.tx.add_from_slip(slip.getWasmSlip());
    }

    public addOutputSlip(slip: Slip) {
        this.tx.add_to_slip(slip.getWasmSlip());
    }

    public get toSlips(): Array<Slip> {
        let slips: WasmSlip[] = this.tx.get_to_slips();
        return slips.map(slip => {
            return new Slip(slip);
        });
    }

    public get fromSlips(): Array<Slip> {
        let slips: WasmSlip[] = this.tx.get_from_slips();
        return slips.map(slip => {
            return new Slip(slip);
        });
    }

    public get type(): TransactionType {
        return this.tx.get_type() as TransactionType;
    }
}
