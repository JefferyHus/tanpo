import { Integration } from './integrations/integration.class';
import { LogLevels } from './logger.types';

export class Logger {
  private integrations: Integration[];

  constructor() {
    this.integrations = [];
  }

  public addIntegration(integration: Integration): Logger {
    this.integrations.push(integration);

    return this;
  }

  public removeIntegration(integration: Integration): Logger {
    this.integrations = this.integrations.filter(
      (currentIntegration) => currentIntegration !== integration,
    );

    return this;
  }

  public hasIntegration(integration: string): boolean {
    return this.integrations.some((currentIntegration) => {
      return currentIntegration.constructor.name === integration;
    });
  }

  public getIntegration(integration: string): Integration | undefined {
    return this.integrations.find(
      (currentIntegration) =>
        currentIntegration.constructor.name === integration,
    );
  }

  public hasIntegrationMethod(integration: string, method: string): boolean {
    if (this.hasIntegration(integration)) {
      const integrationInstance = this.getIntegration(integration);

      if (integrationInstance) {
        return Object.keys(integrationInstance).includes(method);
      }
    }

    return false;
  }

  public getIntegrationMethod(
    integration: string,
    method: string,
  ): () => unknown {
    if (this.hasIntegration(integration)) {
      const integrationInstance = this.getIntegration(integration);

      if (integrationInstance) {
        return Object.getOwnPropertyDescriptor(integrationInstance, method)
          ?.value;
      }
    }

    throw new Error(
      `Integration ${integration} does not have method ${method}`,
    );
  }

  public hasIntegrationProperty(
    integration: string,
    property: string,
  ): boolean {
    if (this.hasIntegration(integration)) {
      const integrationInstance = this.getIntegration(integration);

      if (integrationInstance) {
        return Object.keys(integrationInstance).includes(property);
      }
    }

    return false;
  }

  public getIntegrationProperty(
    integration: string,
    property: string,
  ): unknown {
    if (this.hasIntegration(integration)) {
      const integrationInstance = this.getIntegration(integration);

      if (integrationInstance) {
        return Object.getOwnPropertyDescriptor(integrationInstance, property)
          ?.value;
      }
    }

    throw new Error(
      `Integration ${integration} does not have property ${property}`,
    );
  }

  public log(
    level: LogLevels,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    this.integrations.forEach((integration) => {
      integration.log(level, message, context);
    });
  }

  public loggers(): Integration[] {
    return this.integrations;
  }

  public setup(): void {
    this.integrations.forEach((integration) => {
      integration.setup();
    });
  }
}
