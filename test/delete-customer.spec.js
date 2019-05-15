import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import DeleteCustomer from '../src/delete-customer';

describe('Delete Customer tests', function() {
  let component = new DeleteCustomer();;
  // beforeEach(function() {
  //   component = new DeleteCustomer();
  // });

  // afterEach(function() {
  //   component = null;
  // });

  it('is an instance of delete customer component', function() {
    expect(component).to.exist;
    expect(component).to.be.instanceof(DeleteCustomer);
  });

  it('executes without errors', async () => {
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('customer').data = uuid();

    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph("graph-1").addComponent(component);
    await component.execute();
  });
});
