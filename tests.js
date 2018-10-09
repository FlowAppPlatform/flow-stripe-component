/*
* Tests
*/

const Stripe = require('./stripe');

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