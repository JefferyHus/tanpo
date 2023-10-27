import { IPayment } from './payment.interface';
import { PaymentCurrency } from './payment.types';

export abstract class Payment<T = unknown> implements IPayment {
  _id: string;
  _amount: number;
  _currency: PaymentCurrency;
  _description: string;

  constructor(
    id: string,
    amount: number,
    currency: PaymentCurrency,
    description: string,
  ) {
    this._id = id;
    this._amount = amount;
    this._currency = currency;
    this._description = description;
  }

  set id(id: string) {
    this._id = id;
  }

  set amount(amount: number) {
    this._amount = amount;
  }

  set currency(currency: PaymentCurrency) {
    this._currency = currency;
  }

  set description(description: string) {
    this._description = description;
  }

  abstract init(): this;
  abstract validate(): Promise<this>;
  abstract process(): Promise<T>;
}
