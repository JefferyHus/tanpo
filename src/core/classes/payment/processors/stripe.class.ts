import { Stripe } from 'stripe';

import { logger } from '@/utils/logger';

import { LogLevelsEnum } from '../../logger/logger.types';
import { Payment } from '../payment.abstract';
import { PaymentCurrency } from '../payment.types';

export class StripePayment extends Payment {
  private _token: string;
  private _stripe?: Stripe;
  private _stripeCustomer?: Stripe.Customer;
  private _paymentSource?: Stripe.Source;
  private _paymentSourceToken?: string;
  private _paymentMethod?: Stripe.PaymentMethod;
  private _paymentCharge?: Stripe.Charge;
  private static _instance: StripePayment;

  private constructor(
    id: string,
    amount: number,
    currency: PaymentCurrency,
    description: string,
    token: string,
  ) {
    super(id, amount, currency, description);

    this._token = token;
  }

  static getInstance(
    id: string,
    amount: number,
    currency: PaymentCurrency,
    description: string,
    token: string,
  ): StripePayment {
    if (!StripePayment._instance) {
      StripePayment._instance = new StripePayment(
        id,
        amount,
        currency,
        description,
        token,
      );
    }

    return StripePayment._instance;
  }

  set paymentSourceToken(token: string) {
    this._paymentSourceToken = token;
  }

  init(): this {
    // Initialize Stripe payment gateway
    this._stripe = new Stripe(this._token, {
      apiVersion: '2022-11-15',
    });

    return this;
  }

  async createCustomer(details: {
    name: string;
    email: string;
    phone: string;
  }): Promise<this> {
    // Create Stripe customer
    if (!this._stripe) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Creating Stripe customer...');

    this._stripeCustomer = await this._stripe.customers.create({
      name: details.name,
      email: details.email,
      phone: details.phone,
    });

    logger(LogLevelsEnum.INFO, 'Stripe customer created.', {
      stripeCustomer: this._stripeCustomer,
    });

    return this;
  }

  async createPaymentSource(details: {
    cardNumber: string;
    cardExpMonth: number;
    cardExpYear: number;
    cardCVC: string;
  }): Promise<this> {
    // Create Stripe payment source
    if (!this._stripe || !this._stripeCustomer) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Creating Stripe payment source...');

    if (process.env.NODE_ENV === 'production') {
      this._paymentMethod = await this._stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: details.cardNumber,
          exp_month: details.cardExpMonth,
          exp_year: details.cardExpYear,
          cvc: details.cardCVC,
        },
      });
    }

    logger(LogLevelsEnum.INFO, 'Stripe payment source created.', {
      paymentMethod: this._paymentMethod,
    });

    return this;
  }

  async validate(): Promise<this> {
    // Validate Stripe payment
    if (!this._stripe) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Validating Stripe payment...');

    if (!this._stripeCustomer) {
      throw new Error('Stripe customer is not initialized.');
    }

    if (!this._paymentSourceToken) {
      throw new Error('Stripe payment source token is not initialized.');
    }

    this._paymentCharge = await this._stripe.charges.create({
      amount: this._amount,
      currency: this._currency,
      description: this._description,
      source: this._paymentSourceToken,
      capture: false,
    });

    logger(LogLevelsEnum.INFO, 'Stripe payment validated.', {
      paymentCharge: this._paymentCharge,
    });

    return this;
  }

  async process(): Promise<Stripe.Response<Stripe.Charge>> {
    // Process Stripe payment
    if (!this._stripe || !this._paymentCharge) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Processing Stripe payment...');

    const charge = await this._stripe.charges.capture(this._paymentCharge.id);

    logger(LogLevelsEnum.INFO, 'Stripe payment processed.');

    return charge;
  }

  async createSubscription(
    price: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    // Subscribe Stripe payment
    if (!this._stripe || !this._stripeCustomer) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Subscribing Stripe payment...');

    const subscription = await this._stripe.subscriptions.create({
      customer: this._stripeCustomer.id,
      items: [
        {
          price,
        },
      ],
    });

    logger(LogLevelsEnum.INFO, 'Stripe payment subscribed.');

    return subscription;
  }

  async createPaymentIntent(): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    // Create Stripe payment intent
    if (!this._stripe || !this._stripeCustomer) {
      throw new Error('Stripe payment gateway is not initialized.');
    }

    logger(LogLevelsEnum.INFO, 'Creating Stripe payment intent...');

    const paymentIntent = await this._stripe.paymentIntents.create({
      amount: this._amount,
      currency: this._currency,
      customer: this._stripeCustomer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger(LogLevelsEnum.INFO, 'Stripe payment intent created.');

    return paymentIntent;
  }
}
