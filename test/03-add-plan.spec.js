import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';

import AddPlan from '../src/add-plan';
import MockStore from './mock-store';

describe('Add plan tests', () => {
  const plan_amount = 5000;
  const plan_interval = 'month';
  const plan_name = 'Test Plan';
  const plan_currency = 'usd';


  it('is an instance of add card component', function() {
    const component = new AddPlan();
    expect(component).to.exist;
    expect(component).to.be.instanceof(AddPlan);
  });

  it('executes without errors', (done) => {
    const component = new AddPlan();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('plan_amount').data = plan_amount;
    component.getProperty('plan_interval').data = plan_interval;
    component.getProperty('plan_name').data = plan_name;
    component.getProperty('plan_currency').data = plan_currency;

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
    const component = new AddPlan();
    component.getProperty('secret_key').data = config.stripe_key || travis_stripe_key;
    component.getProperty('plan_amount').data = plan_amount;
    component.getProperty('plan_interval').data = plan_interval;
    component.getProperty('plan_name').data = plan_name;
    component.getProperty('plan_currency').data = plan_currency;

    component.getPort('Success').onEmit(() => {
      const plan = component.getPort('Success').getProperty('Data').data;
      expect(plan).to.exist;
      expect(plan).to.have.property('id');
      expect(plan.object).to.equal('plan');

      // save plan id
      MockStore.plan_id = plan.id;
      done();
    });
    
    // catch any errors and make test fail
    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error).to.not.exist;
      expect(error).message.to.not.exist;
      done();
    });

    new Graph('graph-1').addComponent(component);
    component.execute();
  });
});