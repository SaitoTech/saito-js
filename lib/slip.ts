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
    public static Type: any;

    public constructor(slip?: WasmSlip, json?: any) {
        if (!slip) {
            this.slip = new Slip.Type();
        } else {
            this.slip = slip;
        }
        if (json) {
            this.publicKey = json.publicKey;
            this.type = json.type;
            this.amount = json.amount;
            this.index = json.index;
            this.blockId = json.blockId;
            this.txOrdinal = json.txOrdinal;
            this.utxoKey = json.utxoKey;
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

    public set amount(amount: bigint | number) {
        this.slip.amount = BigInt(amount);
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

    public toJson(): {
        blockId: bigint;
        utxoKey: string;
        amount: bigint;
        index: number;
        publicKey: string;
        txOrdinal: bigint;
        type: any;
    } {
        return {
            publicKey: this.publicKey,
            type: this.type,
            amount: this.amount,
            index: this.index,
            blockId: this.blockId,
            txOrdinal: this.txOrdinal,
            utxoKey: this.utxoKey,
        };
    }

    public clone() {
        return new Slip(undefined, this.toJson());
    }
}
