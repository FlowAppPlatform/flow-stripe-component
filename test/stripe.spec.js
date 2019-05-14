import { expect } from 'chai';

import Stripe from '../src/stripe';

describe('Stripe test', function() {
  it('is an instance of Stripe', function() {
    const stripe =  new Stripe();
    expect(stripe).to.be.instanceOf(Stripe);
  });
});