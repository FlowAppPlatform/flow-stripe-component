/*
 * Tests
 */

const Charge = require('./charge');
const Stripe = require('./stripe');

describe(`Component Tests
`, function() {
  const component = new Charge();
  it('Component should have all required properties', done => {
    try {
      component.getProperty('secret_key');
      component.getProperty('card_number');
      component.getProperty('cvc');
      component.getProperty('expiry_month');
      component.getProperty('expiry_year');
      component.getProperty('currency');
      component.getProperty('amount');
      done();
    } catch(e) { done(new Error('Component missing required properties')); }
  });
  it(`Component should have all required ports with 'Data' property`, done => {
    try {
      component.getPort('Success');
      component.getPort('Error');
      done();
    } catch(e) { done(new Error('Component missing required ports')); }
  });
});

return;

describe(`Stripe Tests
`, function() {
  this.timeout(10000);
  it('Should charge succesfully', done => {
    new Stripe(
      'sk_test_BQokikJOvBiI2HlWgH4olfQ2',
      '4242424242424242', '123', 12, 2023
    )
      .charge('usd', 100)
      .then(response => {
        if (response.status === 'succeeded')
          done();
        else done(new Error('Charge not succesfully made'));
      })
      .catch(err => done(err));
  });
});