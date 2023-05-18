export default class WasmWrapper<T> {
  protected instance: T;
  // static registry: FinalizationRegistry<Deletable<any>> = new FinalizationRegistry<any>(
  //   (instance) => {
  //     console.log("freeing instance : ", instance);
  //     instance.free();
  //   }
  // );

  constructor(instance: T) {
    this.instance = instance;
    // Deletable.registry.register(this, this.instance as any);
  }

  // public free() {
  //   // @ts-ignore
  //   this.instance.free();
  // }
}
