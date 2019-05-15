import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';

import DeletePlan from '../src/delete-plan';
import MockStore from './mock-store';

describe('Delete Plan tests', function() {
  const fake_plan_id = uuid();
  it('is an instance of delete plan component', function() {
    let component = new DeletePlan();
    expect(component).to.exist;
    expect(component).to.be.instanceof(DeletePlan);
  });

  it('executes without errors', async () => {
    let component = new DeletePlan();
    component.getProperty('secret_key').data = config.stripe_key || global.travis_stripe_key;
    component.getProperty('plan').data = fake_plan_id;

    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph('graph-1').addComponent(component);
    await component.execute();
  });

  it('throws Invalid request error when plan id incorrect', (done) => {
    const component = new DeletePlan();
    component.getProperty('secret_key').data = config.stripe_key || global.travis_stripe_key;
    component.getProperty('plan').data = fake_plan_id;


    component.getPort('Success').onEmit(() => {
      const plan = component.getPort('Success').getProperty('Data').data;
      expect(plan).to.not.exist;
      done();
    });

    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error).to.exist;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such plan: ${fake_plan_id}`);
      expect(error.statusCode).to.equal(404);
      done();
    });
    
    new Graph('graph-1').addComponent(component);
    component.execute();
  });

  it('deletes and returns deleted plan on success', (done) => {
    const component = new DeletePlan();
    component.getProperty('secret_key').data = config.stripe_key || global.travis_stripe_key;
    component.getProperty('plan').data = MockStore.plan_id;

    component.getPort('Success').onEmit(() => {
      const plan = component.getPort('Success').getProperty('Data').data;
      expect(plan).to.exist;
      expect(plan).to.have.property('id');
      expect(plan.id).to.equal(MockStore.plan_id);
      expect(plan.object).to.equal('plan');
      expect(plan.deleted).to.be.true;

      // remove subscription from store
      delete MockStore.plan_id;
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
