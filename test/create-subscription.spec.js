import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import CreateSubscription from '../src/create-subscription';

describe('Create Subscription tests', function() {
  let component;
  beforeEach(function() {
    component = new CreateSubscription();
  });

  afterEach(function() {
    component = null;
  });

  it('is an instance of create subscription component', function() {
    expect(component).to.exist;
    expect(component).to.be.instanceof(CreateSubscription);
  });

  it('executes without errors', () => {
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('customer').data = uuid();
    component.getProperty('plan').data = uuid();


    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph("graph-1").addComponent(component);
    return component.execute();
  });
});
