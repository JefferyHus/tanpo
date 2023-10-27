export interface IPayment<T = unknown> {
  init(): this;
  validate(): Promise<this>;
  process(): Promise<T>;
}
