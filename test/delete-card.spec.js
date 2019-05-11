import config from 'config';
import { expect } from 'chai';
import { Graph } from 'flow-platform-sdk';
import uuid from 'uuid/v4';
import DeleteCard from '../src/delete-card';

describe('Delete Card tests', function() {
  let component;
  beforeEach(function() {
    component = new DeleteCard();
  });

  afterEach(function() {
    component = null;
  });

  it('is an instance of delete card component', function() {
    expect(component).to.exist;
    expect(component).to.be.instanceof(DeleteCard);
  });

  it('executes without errors', () => {
    component.getProperty('secret_key').data = config.stripe_key;
    component.getProperty('customer').data = uuid();
    component.getProperty('card_id').data = uuid();


    component.getPort('Success').onEmit(() => {});

    component.getPort('Error').onEmit(() => {
      component.getPort('Error').getProperty('Data').data;
    });
    
    new Graph("graph-1").addComponent(component);
    return component.execute();
  });
});
