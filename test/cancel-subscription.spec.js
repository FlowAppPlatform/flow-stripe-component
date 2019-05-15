import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import CancelSubscription from '../src/cancel-subscription';

describe('Cancel Subscription tests', () => {
  const subscription_id = uuid();

  it('is an instance of cancel subscription component', function() {
    const component = new CancelSubscription();
    expect(component).to.exist;
    expect(component).to.be.instanceof(CancelSubscription);
  });

  it('executes without errors', (done) => {
    const component = new CancelSubscription();
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('subscription').data = subscription_id;


    component.getPort('Success').onEmit(() => {
      done();
    });

    component.getPort('Error').onEmit(() => {
      done();
    });
    
    new Graph("graph-1").addComponent(component);
    component.execute();
  });

  it('throws Invalid request error when subscriptionid incorrect', (done) => {
    const component = new CancelSubscription();
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('subscription').data = subscription_id;


    component.getPort('Success').onEmit(() => {
      done();
    });

    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error).to.exist;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such subscription: ${subscription_id}`);
      expect(error.statusCode).to.equal(404);
      done();
    });
    
    new Graph("graph-1").addComponent(component);
    component.execute();
  });
});
