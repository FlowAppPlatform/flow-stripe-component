# Flow Stripe component
The component is an npm package designed using Flow SDK and implements Stripe's features.

*To use the component, install the package in your NodeJS project*

```
npm install flow-stripe-component --save
```

*Use the component as below*

```javascript
// require the component
const Component = require('flow-stripe-component');

// create instance of the Charge component for example
const component = new Component.Charge();
```

*Provide stripe secret key*

```javascript
// this is routed to Stripe right away, we never store these
component.getProperty('secret_key').data = 'Your_Stripe_Secret_Key';
```

*Provide card details*

```javascript
// this is a test card, be sure to use your own
component.getProperty('card_number').data = '4242424242424242';
component.getProperty('cvc').data = '123';
component.getProperty('expiry_month').data = 11;
component.getProperty('expiry_year').data = 2021;
```

*Provide charge details*

```javascript
// this is required for the Charge component
component.getProperty('currency').data = 'usd';
component.getProperty('amount').data = 100;
```

*Listen in for port emit events*
```javascript
component.getPort('Success').onEmit(function(){
  // the charge was made
  // the server response can be accessed through the 'Data' property of the port
  let response = component.getPort('Success').getProperty('Data').data;
});

component.getPort('Error').onEmit(function(){
  // an error occured
  // the actual error can be accessed through the 'Data' property of the port
  let err = component.getPort('Error').getProperty('Data').data;
});


// mandatory to execute the component
component.execute();
```

#### Conclusion

And that's the Flow Stripe component.

If you are having trouble making charges,
- Check that you are using the correct card details
- Be sure your [Stripe secret key](https://dashboard.stripe.com/account/apikeys) is right.