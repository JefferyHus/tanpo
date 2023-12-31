export type Constructable<T> = new (...args: any[]) => T;
export type Instance<T> = T extends Constructable<infer U> ? U : T;
export type Identifier<T = any> = string | Constructable<T>;
export type ModuleOptions = {
  is_root?: boolean;
  dependencies?: Identifier[];
  controllers?: Identifier[];
  gateways?: Identifier[];
  jobs?: Identifier[];
};
export type SessionCookieSameSite =
  | boolean
  | 'lax'
  | 'strict'
  | 'none'
  | undefined;
export type TokenizedResponse = {
  userId: string;
  token: string;
  refreshToken: string;
};
