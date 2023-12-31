export function WebSocketGateway(port: number): ClassDecorator {
  return (target: any) => {
    const metadata: number[] = Reflect.getMetadata('port', target) ?? [];

    metadata.push(port);

    Reflect.defineMetadata('port', metadata, target);
  };
}
