import type { WasmBlockchain } from "saito-wasm/pkg/node/index";
import WasmWrapper from "./wasm_wrapper";
import Saito from "../saito";
import Block from "./block";
import Transaction from "./transaction";

export default class Blockchain extends WasmWrapper<WasmBlockchain> {
  public static Type: any;
  public callbacks = new Map<string, Array<(_1: Block, _2: Transaction, _3: number) => {}>>();
  public callbackIndices = new Map<string, Array<number>>();
  public confirmations = new Map<string, bigint>();
  last_callback_block_id: number = 0;
  callback_limit: number = 2;
  prune_after_blocks: number = 6;

  constructor(blockchain: WasmBlockchain) {
    super(blockchain);
  }

  public async reset() {
    return this.instance.reset();
  }

  public async affixCallbacks(block: Block) {}

  public async runCallbacks(block_hash: string, from_blocks_back: bigint) {
    let block = await Saito.getInstance().getBlock(block_hash);
    let callbacks = this.callbacks.get(block_hash);
    let callbackIndices = this.callbackIndices.get(block_hash);
    let confirmations = this.confirmations.get(block_hash) || BigInt(-1);
    if (Number(confirmations) && callbacks) {
      for (let i = Number(confirmations) + 1; i < from_blocks_back; i++) {
        for (let j = 0; j < callbacks.length; ++j) {
          try {
            await callbacks[j](block, block.transactions[callbackIndices![j]], i);
          } catch (error) {
            console.error(error);
            console.log("callback index : " + callbackIndices![j]);
            console.error("tx causing error", block.transactions[callbackIndices![j]].msg);
          }
        }
      }
    }
    this.confirmations.set(block_hash, from_blocks_back);
  }

  public async onAddBlockSuccess(block_id: number, hash: string) {
    // TODO : there's currently no way of calling this method from saito-js itself. need to refactor the design related to onConfirmation() calls so a single place will handle all the callback functionality
    let already_processed_callbacks = false;
    if (block_id <= this.last_callback_block_id) {
      already_processed_callbacks = true;
    }

    let block = await Saito.getInstance().getBlock(hash);
    if (!already_processed_callbacks) {
      // this block is initialized with zero-confs processed
      await this.affixCallbacks(block);

      //
      // don't run callbacks if reloading (force!)
      //
      if (block.instance.in_longest_chain && !block.instance.force_loaded) {
        let block_id_to_run_callbacks_from = block.id - BigInt(this.callback_limit + 1);
        let block_id_in_which_to_delete_callbacks = block.id - BigInt(this.prune_after_blocks);
        if (block_id_to_run_callbacks_from <= BigInt(0)) {
          block_id_to_run_callbacks_from = BigInt(1);
        }
        if (block_id_to_run_callbacks_from <= block_id_in_which_to_delete_callbacks) {
          block_id_to_run_callbacks_from = block_id_to_run_callbacks_from + BigInt(1);
        }

        //console.log("block_id_to_run_callbacks_from = " + block_id_to_run_callbacks_from);
        //console.log(
        //   "block_id_in_which_to_delete_callbacks = " + block_id_in_which_to_delete_callbacks
        // );

        if (block_id_to_run_callbacks_from > BigInt(0)) {
          for (let i = block_id_to_run_callbacks_from; i <= block.id; i++) {
            let confirmation_count = block.id - BigInt(i) + BigInt(1);
            let run_callbacks = true;

            // if bid is less than our last-bid but it is still
            // the biggest BID we have, then we should avoid
            // running callbacks as we will have already run
            // them. We check TS as sanity check as well.
            if (block.id < (await this.instance.get_last_block_id())) {
              if (block.instance.timestamp < (await this.instance.get_last_timestamp())) {
                if (block.instance.in_longest_chain) {
                  run_callbacks = false;
                }
              }
            }

            if (run_callbacks) {
              let callback_block_hash = await this.instance.get_longest_chain_hash_at(i);
              if (callback_block_hash !== "") {
                await this.runCallbacks(callback_block_hash, confirmation_count);
              }
            }
          }
        }

        //
        // delete callbacks as appropriate to save memory
        //
        if (block_id_in_which_to_delete_callbacks >= 0) {
          let callback_block_hash = await this.instance.get_longest_chain_hash_at(
            block_id_in_which_to_delete_callbacks + BigInt(1) // because block ring starts from 1
          );
          this.callbacks.delete(callback_block_hash);
          this.callbackIndices.delete(callback_block_hash);
          this.confirmations.delete(callback_block_hash);
        }
      }

      console.log("moving into onNewBlock : " + block.hash + " -- id : " + block.id);

      await this.onNewBlock(block, block.instance.in_longest_chain);
    }
  }

  public async onNewBlock(block: Block, lc: boolean) {}

  public async getLatestBlockId() {
    return this.instance.get_latest_block_id();
  }

  public async getLongestChainHashAtId(blockId: bigint) {
    return this.instance.get_longest_chain_hash_at_id(blockId);
  }

  public async getHashesAtId(blockId: bigint) {
    return this.instance.get_hashes_at_id(blockId);
  }
}
