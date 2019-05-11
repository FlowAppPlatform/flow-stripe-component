import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import CreateCustomer from '../src/create-customer';

describe('Create Customer tests', function() {
  let component;
  beforeEach(function() {
    component = new CreateCustomer();
  });

  afterEach(function() {
    component = null;
  });

  it('is an instance of create customer component', function() {
    expect(component).to.exist;
    expect(component).to.be.instanceof(CreateCustomer);
  });

  it('executes without errors', () => {
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('card_number').data = '4242424242424242';
    component.getProperty('cvc').data = '123';
    component.getProperty('exp_month').data = '11';
    component.getProperty('exp_year').data = '2021';

    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph("graph-1").addComponent(component);
    return component.execute();
  });
});
