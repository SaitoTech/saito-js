export default class Saito {
    private static instance: Saito = new Saito();
    private static wasmInstance: any;

    private constructor() {
    }

    public static async initialize() {
        let result = await import("saito-wasm");
        await result.default(undefined);
        Saito.wasmInstance = result;
    }

    public static getInstance(): Saito {
        if (!Saito.wasmInstance) {
            throw new Error("saito-wasm lib not loaded");
        }
        return Saito.instance;
    }
    
}

(async () => {
    await Saito.initialize();
    let saito = Saito.getInstance();


})().then(() => {
    console.log("program run");
});
