import type {WasmSlip} from 'saito-wasm/dist/types/pkg/node/index_bg';

export enum SlipType {
    Normal = 0,
    ATR = 1,
    VipInput = 2,
    VipOutput = 3,
    MinerInput = 4,
    MinerOutput = 5,
    RouterInput = 6,
    RouterOutput = 7,
    Other = 8,
}

export default class Slip {
    private slip: WasmSlip;

    public constructor(slip?: WasmSlip) {

        if (!slip) {
            // @ts-ignore
            this.slip = new WasmSlip();
        } else {
            this.slip = slip;
        }
    }

    public get wasmSlip(): WasmSlip {
        return this.slip;
    }

    public get type(): SlipType {
        return this.slip.slip_type as SlipType;
    }

    public set type(type: SlipType) {
        this.slip.slip_type = type as number;
    }

    public get amount(): bigint {
        return this.slip.amount;
    }

    public set amount(amount: bigint) {
        this.slip.amount = amount;
    }

    public get publicKey(): string {
        return this.slip.public_key;
    }

    public set publicKey(key: string) {
        this.slip.public_key = key;
    }

    public set index(index: number) {
        this.slip.slip_index = index;
    }

    public get index(): number {
        return this.slip.slip_index;
    }

    public set blockId(id: bigint) {
        this.slip.block_id = id;
    }

    public get blockId(): bigint {
        return this.slip.block_id;
    }

    public set txOrdinal(ordinal: bigint) {
        this.slip.tx_ordinal = ordinal;
    }

    public get txOrdinal(): bigint {
        return this.slip.tx_ordinal;
    }

    public set utxoKey(key: string) {
        this.slip.utxo_key = key;
    }

    public get utxoKey(): string {
        return this.slip.utxo_key;
    }
}