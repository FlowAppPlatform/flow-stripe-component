import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';

import AddCard from '../src/add-card';
import MockStore from './mock-store';

describe('Add card tests', () => {
  const card_number = '4242424242424242';
  const cvc = '123';
  const exp_month = '11';
  const exp_year = '2021';
  const fake_customer_id = uuid();

  it('is an instance of add card component', function() {
    const component = new AddCard();
    expect(component).to.exist;
    expect(component).to.be.instanceof(AddCard);
  });

  it('executes without errors', (done) => {
    const component = new AddCard();
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;
    component.getProperty('customer').data = fake_customer_id;

    component.getPort('Success').onEmit(() => {
      done();
    });

    component.getPort('Error').onEmit(() => {
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('returns card details on success', (done) => {
    const component = new AddCard();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;
    component.getProperty('customer').data = MockStore.customer_id;

    component.getPort('Success').onEmit(() => {
      const card = component.getPort('Success').getProperty('Data').data;
      expect(card).to.exist;
      expect(card).to.have.property('id');
      expect(card.object).to.equal('card');
      expect(card.customer).to.equal(MockStore.customer_id);

      // save card id
      MockStore.card_id = card.id;
      done();
    });
    
    component.getPort('Error').onEmit(() => {
      done();
    });

    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('it throws error when customer_id is incorrect',  (done) => {
    const component = new AddCard();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;
    component.getProperty('customer').data = fake_customer_id;

    component.getPort('Success').onEmit(() => {
      const card = component.getPort('Success').getProperty('Data').data;
      expect(card).to.not.exist;
      done();
    });
    
    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such customer: ${fake_customer_id}`);
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });
});