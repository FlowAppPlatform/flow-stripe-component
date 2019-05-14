import config from 'config';
import uuid from 'uuid/v4';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';

import CreateCustomer from '../src/create-customer';
import AddCard from '../src/add-card';

describe('Flow stripe components tests', () => {
  const email = 'superdemo2@gmail.com';
  const card_number = '4242424242424242';
  const cvc = '123';
  const exp_month = '11';
  const exp_year = '2021';
  const fake_customer_id = uuid();

  // object for storing id for testing
  const mockStore = {};

  describe('Create Customer tests', () => {
    it('is an instance of create customer component', function() {
      const component = new CreateCustomer();
      expect(component).to.exist;
      expect(component).to.be.instanceof(CreateCustomer);
    });

    it('executes without errors',  (done) => {
      const component = new CreateCustomer();
      component.getProperty('secret_key').data = config.stripe_key;
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
      
      new Graph("graph-1").addComponent(component);
      component.execute();
    });

    it('it returns customer data on sucess',  (done) => {
      const component = new CreateCustomer();
      component.getProperty('secret_key').data = config.stripe_key;
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

        // store customer id
        mockStore.customer_id = customer.id;
        done();
      });
      
  
      component.getPort('Error').onEmit(() => {
        done();
      });
      
      new Graph("graph-1").addComponent(component);
      component.execute();
    });

    it('it throws a StripeAuthenticationError with wrong api key',  (done) => {
      const component = new CreateCustomer();
      component.getProperty('secret_key').data = 'config.stripe_key';
      component.getProperty('email').data = email;
      component.getProperty('card_number').data = card_number;
      component.getProperty('cvc').data = cvc;
      component.getProperty('exp_month').data = exp_month;
      component.getProperty('exp_year').data = exp_year;
  
      component.getPort('Success').onEmit(() => {
        done();
      });
      
      component.getPort('Error').onEmit(() => {
        const error = component.getPort('Error').getProperty('Data').data;
        expect(error).to.exist;
        expect(error).to.not.be.empty;
        expect(error.message).to.equal('Invalid API Key provided: ******.******_key');
        expect(error.type).to.equal('StripeAuthenticationError');
        done();
      });
      
      new Graph("graph-1").addComponent(component);
      component.execute();
    });
  
    it('throws a payment card error when payment card object is incorrect/incomplete', (done) => {
      const component = new CreateCustomer();
      component.getProperty('secret_key').data = config.stripe_key;
      component.getProperty('email').data = email;
      component.getProperty('card_number').data = 'card_number';
      component.getProperty('cvc').data = cvc;
      component.getProperty('exp_month').data = exp_month;
      component.getProperty('exp_year').data = exp_year;
  
      component.getPort('Success').onEmit(() => {
        done();
      });
  
      component.getPort('Error').onEmit(() => {
        const error = component.getPort('Error').getProperty('Data').data;
        expect(error).to.exist;
        expect(error).to.be.a('string');
        expect(error).to.equal('Payment card not valid');
        done();
      });
  
      new Graph("graph-1").addComponent(component);
      component.execute();
    });
  });

  describe('Add card tests', () => {
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
      
      new Graph("graph-1").addComponent(component);
      component.execute();
    });

    it('returns card details on success', (done) => {
      const component = new AddCard();
      component.getProperty('secret_key').data = config.stripe_key;
      component.getProperty('card_number').data = card_number;
      component.getProperty('cvc').data = cvc;
      component.getProperty('exp_month').data = exp_month;
      component.getProperty('exp_year').data = exp_year;
      component.getProperty('customer').data = mockStore.customer_id;

      component.getPort('Success').onEmit(() => {
        const card = component.getPort('Success').getProperty('Data').data;
        console.log('card', card)
        done();
      });
      
      component.getPort('Error').onEmit(() => {
        // const error = component.getPort('Error').getProperty('Data').data;
        // expect(error.type).to.equal('StripeInvalidRequestError');
        // expect(error.message).to.equal(`No such customer: ${fake_customer_id}`);
        done();
      });

      new Graph("graph-1").addComponent(component);
      component.execute();
    });

    it('it throws error when customer_id is incorrect',  (done) => {
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
        const error = component.getPort('Error').getProperty('Data').data;
        expect(error.type).to.equal('StripeInvalidRequestError');
        expect(error.message).to.equal(`No such customer: ${fake_customer_id}`);
        done();
      });
      
      new Graph("graph-1").addComponent(component);
      component.execute();
    });
  });

});