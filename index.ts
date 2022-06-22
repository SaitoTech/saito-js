// @ts-ignore
// const saito = require("saito-wasm/dist/index.node");

export default class Saito {
    static instance = new Saito();

    // static wasmInstance: typeof import("saito-wasm");

    constructor() {
    }

    static async initialize() {

        // let result = await import("saito-wasm");

        // .then((saito) => {
        //     console.log("rrrrrrrrrrrrrrr");
        //     console.log(saito);
        //     return saito;
        // })
        // .then(saito => {
        //     console.log("saito initialize...");
        //     // console.log(saito);
        //     console.log(saito.initialize_sync);
        //     console.log(saito.initialize);
        //     Saito.wasmInstance = saito;
        //     return saito.initialize_sync();
        // })
        // .then(result => {
        //     console.log("result = ", result);
        // });
        // @ts-ignore
        // import("saito-wasm").then(saito => {
        //     // this.wasmInstance = saito;
        //     console.log("saito = ", saito);
        //     // saito.initialize_sync();
        //     // console.log("wasm loaded");
        // })
        // console.log("saito loaded");
        // let saito = import("saito-wasm");
        // console.log("2 saito = ", saito);
        // let s = await saito;
        // console.log("3 saito = ", s);
        let saito;
        if (typeof window === "undefined") {
            console.log("loading server lib");
            // @ts-ignore
            saito = await import("saito-wasm/dist/server");
        } else {
            console.log("loading browser lib");
            // @ts-ignore
            saito = await import("saito-wasm/dist/browser");
        }
        
        // @ts-ignore
        // saito = await import("saito-wasm/dist/index.node");
        console.log("1111111111 : ", saito);
        // console.log(s);

        // console.log("default = ", saito.default);
        // saito.initialize_sync();


        // let result = await import("./node_modules/saito-wasm/saito_wasm");
        // console.log(result);
        // // await result.default;
        //
        // let saito = new result.SaitoWasm();
        // Saito.wasmInstance = result;
    }

    // static getInstance() {
    //     if (!Saito.wasmInstance) {
    //         throw new Error("saito-wasm lib not loaded");
    //     }
    //     return Saito.instance;
    // }
    //
    // convertTransactionForApplication() {
    //     // @ts-ignore
    //     let slip = WasmSlip.new();
    //     // @ts-ignore
    //     let transaction = WasmTransaction.new();
    //
    //     Saito.wasmInstance.send_transaction(transaction);
    // }

    convertTransactionForCore() {

    }
}

(async () => {
    await Saito.initialize().then(() => {
        console.log("lib initialized");
    });
    // let saito = Saito.getInstance();

    // doing random stuff
    // saito.convertTransactionForApplication();
})().then(() => {
    console.log("program run");
});
