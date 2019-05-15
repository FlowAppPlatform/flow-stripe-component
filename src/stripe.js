import stripe from 'stripe';
import validator from 'card-validator';

/**
 * @param {String} key stripe api key
 * @param {Number} card_number
 * @param {Number} cvc
 * @param {Number} exp_month
 * @param {Number} exp_year
 */
export default class Stripe {
  constructor(key, card_number, cvc, exp_month, exp_year) {
    this.card = {
      'number': card_number,
      'cvc': cvc,
      'exp_month': exp_month,
      'exp_year': exp_year
    };
    if (process.env.NODE_ENV === 'testing') return;
    this.stripe = stripe(key);
  }
  
  async createCustomer(email) {
    if (process.env.NODE_ENV === 'testing') {
      return new Promise(
        res => res({ status: 'succeeded' })
      );
    }
    try {
      if (!this._isCardValid()) {
        throw new Error('Payment card not valid');
      }
      const token = await this._createToken();
      
      return await this.stripe.customers.create({
        source: token.id,
        email
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteCustomer(customer) {
    try {
      return await this.stripe.customers.del(customer);
    } catch (err) {
      throw err;
    }
  }

  async createSubscription(customer, plan) {
    try {
      return await this.stripe.subscriptions.create({
        customer,
        items: [{
          plan,
        }]
      });
    } catch (err) {
      throw err;
    }
  }

  async cancelSubscription (subscription) {
    try {
      return await this.stripe.subscriptions.del(subscription);
    } catch (err) {
      throw err;
    }
  }

  async addCard(customer) {
    try {
      if (!this._isCardValid()) {
        throw 'Payment card not valid';
      }
      const token = await this._createToken();
      return await this.stripe.customers.createSource(
        customer,
        { source: token.id},
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteCard(customer, card_id) {
    try {
      return await this.stripe.customers.deleteSource(customer, card_id);
    } catch (err) {
      throw err;
    }
  }

  async addPlan(amount, interval, name, currency, trial_period_days) {
    try {
      return await this.stripe.plans.create({
        amount,
        interval,
        product: {
          name,
        },
        currency,
        trial_period_days
      });
    } catch (err) {
      throw err;
    }
  }

  async deletePlan(plan) {
    try {
      return await this.stripe.plans.del(plan);
    } catch (err) {
      throw err;
    }
  }

  async _createToken() {
     try {
       return await this.stripe.tokens.create({
         card: this.card
       });
     } catch (err) {
       throw err;
     }
  }

  _isCardValid(card = this.card) {
    return (
      validator.number(card.number).isValid &&
      validator.expirationMonth(card.exp_month).isValid &&
      validator.expirationYear(card.exp_year).isValid &&
      validator.cvv(card.cvc).isValid
    );
  }
}
