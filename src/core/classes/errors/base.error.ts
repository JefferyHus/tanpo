export class BaseError extends Error {
  private _message: string;
  private _name: string;
  private _stack: string | undefined;
  private _status: number;

  constructor(message: string, status = 400) {
    super(message);
    this._message = message;
    this._status = status;
    this._name = this.constructor.name;
    this._stack = new Error(message).stack;
  }

  set message(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }

  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  set stack(stack: string | undefined) {
    this._stack = stack;
  }

  get stack(): string | undefined {
    return this._stack;
  }

  set status(status: number) {
    this._status = status;
  }

  get status(): number {
    return this._status;
  }

  toJSON(): unknown {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      status: this.status,
    };
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
