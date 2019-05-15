import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';

import CreateSubscription from '../src/create-subscription';
import MockStore from './mock-store';

describe('Create Subscription tests', function() {
  const customer_id = uuid();
  const plan_id = uuid();

  it('is an instance of create subscription component', function() {
    const component = new CreateSubscription();
    expect(component).to.exist;
    expect(component).to.be.instanceof(CreateSubscription);
  });

  it('executes without errors', (done) => {
    const component = new CreateSubscription();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('customer').data = customer_id;
    component.getProperty('plan').data = plan_id;


    component.getPort('Success').onEmit(() => {
      done();
    });

    component.getPort('Error').onEmit(() => {
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('it throws error when customer_id is incorrect',  (done) => {
    const component = new CreateSubscription();
    component.getProperty('secret_key').data = config.stripe_key|| travis_stripe_key;
    component.getProperty('customer').data = customer_id;
    component.getProperty('plan').data = plan_id;
    
    component.getPort('Success').onEmit(() => {
      const subscription = component.getPOrt('Success').getProperty('Data').data;
      expect(subscription).to.not.exist;
      done();
    });
    
    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such customer: ${customer_id}`);
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('returns subscription details on success',  (done) => {
    const component = new CreateSubscription();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('customer').data = MockStore.customer_id;
    component.getProperty('plan').data = MockStore.plan_id;
    
    component.getPort('Success').onEmit(() => {
      const subscription = component.getPort('Success').getProperty('Data').data;
      expect(subscription).to.exist;
      expect(subscription).to.have.property('id');
      expect(subscription.customer).to.equal(MockStore.customer_id);
      expect(subscription.plan.id).to.equal(MockStore.plan_id);
      expect(subscription.status).to.equal('active');

      // save subscription id
      MockStore.subscription_id = subscription.id;
      
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
