const stripe = require('stripe');
const validator = require('card-validator');
const q = require('q');

/*
 *
 * 
 */

class Stripe {

  constructor(key, card_number, cvc, exp_month, exp_year) {
    this.stripe = stripe(key);
    this.card = {
      'number': card_number.toString(),
      'exp_month': exp_month.toString(),
      'exp_year': exp_year.toString(),
      'cvc': cvc.toString()
    };
  }

  charge(currency, amount) {
    let t = this;
    if (!this.isCardValid()) return new Error('Payment card not valid');
    const d = q.defer();
    this.stripe.tokens.create({
      card: this.card
    }, function (err, token) {
      if (err) d.reject(err);
      t._charge(d, token, currency, amount);
    });
    return d.promise;
  }

  _charge(d, token, currency, amount) {
    try {      
      this.stripe.charges.create({
        amount: amount,
        currency: currency,
        source: token.id
      }, function (err, charge) {
        if (err) d.reject(err);
        d.resolve(charge);
      });
    } catch (e) { d.reject(e); }
  }

  isCardValid(card = this.card) {
    return (
      validator.number(card.number).isValid &&
      validator.expirationMonth(card.exp_month).isValid &&
      validator.expirationYear(card.exp_year).isValid &&
      validator.cvv(card.cvc).isValid
    );
  }

}

module.exports = Stripe;