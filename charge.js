var Flow = require('flow-platform-sdk');
var Stripe = require('./stripe');

/*
*
* This component makes a charge to a card
*
* The component has 6 properties - `secret_key`, `card_number`, `cvc`, `expiry_month`, `expiry_year`,  `currency`, and `amount`
* 
* The component has 2 ports respective to the charge statuses `Success`, `Error`
* The ports each have the `Data` property, the response from Stripe
*
*/

class Charge extends Flow.Component {
  
  constructor(id = null) {

    super(id);
    this.name = 'Charge';

    var secret_key = new Flow.Property('secret_key', 'text');
    secret_key.required = true;

    var card_number = new Flow.Property('card_number', 'text');
    card_number.required = true;

    var cvc = new Flow.Property('cvc', 'text');
    cvc.required = true;

    var expiry_month = new Flow.Property('expiry_month', 'number');
    expiry_month.required = true;

    var expiry_year = new Flow.Property('expiry_year', 'number');
    expiry_year.required = true;

    var currency = new Flow.Property('currency', 'text');
    currency.required = true;

    var amount = new Flow.Property('amount', 'number');
    amount.required = true;

    this.addProperty(secret_key);
    this.addProperty(card_number);
    this.addProperty(cvc);
    this.addProperty(expiry_month);
    this.addProperty(expiry_year);
    this.addProperty(currency);
    this.addProperty(amount);

    var success = new Flow.Port('Success');
    var error = new Flow.Port('Error');

    var response = new Flow.Property('Data', 'object');
    response.required = true;
    success.addProperty(response);
    
    var generalError = new Flow.Property('Data', 'object');
    generalError.required = true;
    error.addProperty(generalError);
    
    this.addPort(success);
    this.addPort(error);

    // make charge here
    this.attachTask(function() {
      let task = 
        new Stripe(
          this.getProperty('secret_key').data,
          this.getProperty('card_number').data,
          this.getProperty('cvc').data,
          this.getProperty('expiry_month').data,
          this.getProperty('expiry_year').data
        ).charge(
          this.getProperty('currency').data,
          this.getProperty('amount').data
        );
      
      if (task instanceof Error) {
        const port = this.getPort('Error');
        port.getProperty('Data').data = task;
        port.emit();
        this.taskComplete();
        return;
      }
      task
        .then(response => {
          const port = this.getPort('Success');
          port.getProperty('Data').data = response;
          port.emit();
          this.taskComplete();
        })
        .catch(err => {
          const port = this.getPort('Error');
          port.getProperty('Data').data = err;
          port.emit();
          this.taskComplete();
        });
    });

  }
}

module.exports = Charge;