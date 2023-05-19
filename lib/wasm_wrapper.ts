export default class WasmWrapper<T> {
  protected instance: T;

  constructor(instance: T) {
    this.instance = instance;
  }
}
