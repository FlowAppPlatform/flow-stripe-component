/*
 * Tests
 */

const Graph = require('flow-platform-sdk').Graph;
const Charge = require('./charge');

describe(`Component Tests
`, function() {
  const component = new Charge();
  it('Component should execute without errors', done => {
    component.getProperty('secret_key').data = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
    component.getProperty('card_number').data = '4242424242424242';
    component.getProperty('cvc').data = '123';
    component.getProperty('expiry_month').data = 11;
    component.getProperty('expiry_year').data = 2021;
    component.getProperty('currency').data = 'usd';
    component.getProperty('amount').data = 100;

    component.getPort('Success').onEmit(() => {
      done();
    });
    component.getPort('Error').onEmit(() => {
      done(component.getPort('Error').getProperty('Data').data);
    });

    new Graph("graph-1").addComponent(component);
    component.execute();
  });
  it(`Component should have all required ports with 'Data' property`, done => {
    try {
      component.getPort('Success').getProperty('Data');
      component.getPort('Error').getProperty('Data');
      done();
    } catch(e) { done(new Error('Component missing required ports')); }
  });
});