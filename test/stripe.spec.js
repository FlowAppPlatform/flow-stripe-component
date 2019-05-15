import { expect } from 'chai';
import config from 'config';
import uuid from 'uuid/v4';

import Stripe from '../src/stripe';

describe('Stripe test', function() {
  const email = 'superdemo2@gmail.com';
  const card_number = '4242424242424242';
  const cvc = '123';
  const exp_month = '11';
  const exp_year = '2021';
  const fake_key = uuid();
  const fake_card = uuid();

  it('is an instance of Stripe', function() {
    const stripe =  new Stripe();
    expect(stripe).to.be.instanceOf(Stripe);
  });

  it('throws a Stripe Authenticated Error with wrong api key', async () => {
    const stripe =  new Stripe(
      fake_key, card_number, cvc, exp_month, exp_year
    );

    try {
      const response = await stripe.createCustomer(email);
      expect(response).to.not.exist;
    } catch (err) {
      expect(err).to.be.instanceOf(Error);
      expect(err).to.throw;
      expect(err.type).to.equal('StripeAuthenticationError');
    }
  });

  it('throws a payment card error when payment card object is incorrect/incomplete', async () => {
    const stripe =  new Stripe(
      config.stripe_key || global.travis_stripe_key, fake_card, cvc, exp_month, exp_year
    );

    try {
      const response = await stripe.createCustomer(email);
      expect(response).to.not.exist;
    } catch (err) {
      expect(err).to.be.instanceOf(Error);
      expect(err).to.throw;
      expect(err.message).to.equal('Payment card not valid');
    }
  });
});