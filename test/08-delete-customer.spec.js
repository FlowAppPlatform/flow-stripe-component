import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';

import DeleteCustomer from '../src/delete-customer';
import MockStore from './mock-store';

describe('Delete Customer tests', function() {
  const fake_customer_id = uuid();
  it('is an instance of delete customer component', function() {
    let component = new DeleteCustomer();
    expect(component).to.exist;
    expect(component).to.be.instanceof(DeleteCustomer);
  });

  it('executes without errors', async () => {
    let component = new DeleteCustomer();
    component.getProperty('secret_key').data = config.stripe_key || process.env.travis_stripe_key;
    component.getProperty('customer').data = fake_customer_id;

    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph('graph-1').addComponent(component);
    await component.execute();
  });

  it('throws Invalid request error when customer id incorrect', (done) => {
    const component = new DeleteCustomer();
    component.getProperty('secret_key').data = config.stripe_key || process.env.travis_stripe_key;
    component.getProperty('customer').data = fake_customer_id;


    component.getPort('Success').onEmit(() => {
      const customer = component.getPort('Success').getProperty('Data').data;
      expect(customer).to.not.exist;
      done();
    });

    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error).to.exist;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such customer: ${fake_customer_id}`);
      expect(error.statusCode).to.equal(404);
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('deletes and returns deleted customer on success', (done) => {
    const component = new DeleteCustomer();
    component.getProperty('secret_key').data = config.stripe_key || process.env.travis_stripe_key;
    component.getProperty('customer').data = MockStore.customer_id;

    component.getPort('Success').onEmit(() => {
      const customer = component.getPort('Success').getProperty('Data').data;
      expect(customer).to.exist;
      expect(customer).to.have.property('id');
      expect(customer.id).to.equal(MockStore.customer_id);
      expect(customer.object).to.equal('customer');
      expect(customer.deleted).to.be.true;

      // remove subscription from store
      delete MockStore.customer_id;
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
