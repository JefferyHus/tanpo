import { BODY_PARSER_OPTIONS_METADATA } from '@/constants';

export interface ParserOptions {
  // the type of the body object
  body?: 'json' | 'raw' | 'text' | 'urlencoded';
  // body-parser options
  inflate?: boolean; // when true, deflated bodies will be inflated
  strict?: boolean; // only parse arrays and objects for JSON body
  limit?: string; // maximum request body size
  type?: string | string[]; // content type(s) to parse
  extended?: boolean; // parse extended syntax with the qs module
}

export function SetParserOptions(options: ParserOptions): MethodDecorator {
  return (
    _target: object,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      BODY_PARSER_OPTIONS_METADATA,
      options,
      descriptor.value,
    );

    return descriptor;
  };
}
