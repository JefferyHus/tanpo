declare module 'stripe' {
  namespace Stripe {
    namespace Event {
      namespace Data {
        interface Object {
          id: string;
          customer: string;
          status:
            | 'active'
            | 'past_due'
            | 'unpaid'
            | 'canceled'
            | 'incomplete'
            | 'incomplete_expired'
            | 'trialing'
            | 'paused';
          plan: {
            id: string;
          };
        }
      }
    }

    interface Subscription {
      plan: Stripe.Plan;
    }
  }
}
