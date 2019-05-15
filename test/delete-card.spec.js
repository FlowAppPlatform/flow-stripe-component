import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import DeleteCard from '../src/delete-card';

describe('Delete Card tests', function() {
  const customer_id = uuid();
  const card_id = uuid();

  it('is an instance of delete card component', function() {
    const component = new DeleteCard();
    expect(component).to.exist;
    expect(component).to.be.instanceof(DeleteCard);
  });

  it('executes without errors', (done) => {
    const component = new DeleteCard();
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('customer').data = customer_id;
    component.getProperty('card_id').data = card_id;


    component.getPort('Success').onEmit(() => {
      done();
    });

    component.getPort('Error').onEmit(function() {
      done();
    });
    
    new Graph("graph-1").addComponent(component);
    component.execute();
  });

  it('it throws error when customer_id is incorrect',  (done) => {
    const component = new DeleteCard();
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('customer').data = customer_id;
    component.getProperty('card_id').data = card_id;

    component.getPort('Success').onEmit(() => {
      done();
    });
    
    component.getPort('Error').onEmit(() => {
      const error = component.getPort('Error').getProperty('Data').data;
      expect(error.type).to.equal('StripeInvalidRequestError');
      expect(error.message).to.equal(`No such customer: ${customer_id}`);
      done();
    });
    
    new Graph("graph-1").addComponent(component);
    component.execute();
  });
});
