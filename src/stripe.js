import stripe from "stripe";
import validator from "card-validator";

/**
 * @param String key: stripe api key
 * @param Number card: card object
 */
export default class Stripe {
  constructor(key, card_number, cvc, exp_month, exp_year) {
    this.card = {
      "number": card_number,
      "cvc": cvc,
      "exp_month": exp_month,
      "exp_year": exp_year
    };
    if (process.env.NODE_ENV === "testing") return;
    this.stripe = stripe(key);
  }
  
  async createCustomer() {
    if (process.env.NODE_ENV === "testing") {
      return new Promise(
        res => res({ status: "succeeded" })
      );
    }
    try {
      if (!this._isCardValid()) {
        throw "Payment card not valid";
      }
      const token = await this._createToken();
      return await this.stripe.customers.create({
        source: token,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteCustomer(customer) {
    try {
      return await this.stripe.customers.del(customer);
    } catch (err) {
      throw new Error(err);
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
      throw new Error(err);
    }
  }

  async cancelSubscription (subscription) {
    try {
      return await this.stripe.subscriptions.del(subscription);
    } catch (err) {
      throw new Error(err);
    }
  }

  async addCard(customer, card_number, cvc, exp_month, exp_year) {
    try {
      this.card = {
        "number": card_number,
        "cvc": cvc,
        "exp_month": exp_month,
        "exp_year": exp_year
      };
      if (!this._isCardValid()) {
        throw "Payment card not valid";
      }
      const token = await this._createToken();
      return await this.stripe.customers.createSource(
        customer,
        { source: token },
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteCard(customer, cardId) {
    try {
      return await this.stripe.customers.deleteSource(customer, cardId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async _createToken() {
    try {
      return await this.stripe.tokens.create({
        card: this.card,
      });
    } catch (err) {
      throw new Error(err);
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
