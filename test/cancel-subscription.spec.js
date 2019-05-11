import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import CancelSubscription from '../src/cancel-subscription';

describe('Cancel Subscription tests', function() {
  let component;
  beforeEach(function() {
    component = new CancelSubscription();
  });

  afterEach(function() {
    component = null;
  });

  it('is an instance of cancel subscription component', function() {
    expect(component).to.exist;
    expect(component).to.be.instanceof(CancelSubscription);
  });

  it('executes without errors', () => {
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('subscription').data = uuid();


    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph("graph-1").addComponent(component);
    return component.execute();
  });
});
