import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';

import CreateCustomer from '../src/create-customer';
import MockStore from './mock-store';

describe('Create Customer tests', () => {
  const email = 'superdemo2@gmail.com';
  const card_number = '4242424242424242';
  const cvc = '123';
  const exp_month = '11';
  const exp_year = '2021';

  it('is an instance of create customer component', function() {
    const component = new CreateCustomer();
    expect(component).to.exist;
    expect(component).to.be.instanceof(CreateCustomer);
  });

  it('executes without errors',  (done) => {
    const component = new CreateCustomer();
    component.getProperty('secret_key').data = config.stripe_key || global.travis_stripe_key;
    component.getProperty('email').data = email;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;

    component.getPort('Success').onEmit(() => {
      done();
    });
    

    component.getPort('Error').onEmit(() => {
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('it returns customer data on sucess',  (done) => {
    const component = new CreateCustomer();
    component.getProperty('secret_key').data = config.stripe_key || global.travis_stripe_key;
    component.getProperty('email').data = email;
    component.getProperty('card_number').data = card_number;
    component.getProperty('cvc').data = cvc;
    component.getProperty('exp_month').data = exp_month;
    component.getProperty('exp_year').data = exp_year;

    component.getPort('Success').onEmit(() => {
      const customer = component.getPort('Success').getProperty('Data').data;
      expect(customer).to.exist;
      expect(customer).to.be.an('object');
      expect(customer).to.have.property('id');
      expect(customer.object).to.equal('customer');
      expect(customer.email).to.equal(email);

      // save customer id
      MockStore.customer_id = customer.id;
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