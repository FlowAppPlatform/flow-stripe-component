import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';

import Charge from '../src/charge';
import MockStore from './mock-store';

describe('Charge tests', () => {
  const card_number = '4242424242424242';
  const cvc = '123';
  const exp_month = '11';
  const exp_year = '2021';
  const amount = 500;
  const currency = 'usd';

  it('is an instance of charge component', function() {
    const component = new Charge();
    expect(component).to.exist;
    expect(component).to.be.instanceof(Charge);
  });

  it('executes without errors',  (done) => {
    const component = new Charge();
    component.getProperty('secret_key').data = config.stripe_key || process.env.travis_stripe_key;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;
    component.getProperty('amount').data = amount;
    component.getProperty('currency').data = currency;

    component.getPort('Success').onEmit(() => {
      done();
    });
    

    component.getPort('Error').onEmit(() => {
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('it returns charge data on sucess',  (done) => {
    const component = new Charge();
    component.getProperty('secret_key').data = config.stripe_key || process.env.travis_stripe_key;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;
    component.getProperty('currency').data = currency;
    component.getProperty('amount').data = amount;
    // optional property
    component.getProperty('customer_id').data = MockStore.customer_id;

    component.getPort('Success').onEmit(() => {
      const charge = component.getPort('Success').getProperty('Data').data;
      expect(charge).to.exist;
      expect(charge).to.be.an('object');
      expect(charge).to.have.property('id');
      expect(charge.object).to.equal('charge');
      expect(charge.amount).to.equal(amount);
      expect(charge.captured).to.be.true;
      expect(charge.currency).to.equal(currency);

      done();
    });
    
    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error).to.not.exist;
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });
});