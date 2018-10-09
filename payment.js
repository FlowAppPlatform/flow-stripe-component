var Flow = require('flow-platform-sdk');
var Stripe = require('./stripe');

/*
*
* This component sends sms
*
* The component has 5 properties - `Account SID`, `Authentication Token`, From`, `To`, and `Body`
* The component has 2 ports respective to the sms statuses `Sent`, `Error`
* The ports each have the `Data` property, the response from Twilio
*
*/

class Payment extends Flow.Component {
  
  constructor() {

    super();    
    this.name = 'Payment';

    // make charge here
    this.attachTask(function () {
      let task = 
        new Stripe(
          this.getProperty('ACCOUNT_SID').data,
          this.getProperty('AUTH_TOKEN').data,
          this.getProperty('From').data,
          this.getProperty('To').data,
          this.getProperty('Body').data
        ).create();
      
      if (task instanceof Error) {
        const port = this.getPort('Error');
        port.getProperty('Data').data = task;
        port.emit();
        this.taskComplete();
        return;
      }
      task
        .then(response => {
          const port = this.getPort('Sent');
          port.getProperty('Data').data = response;
          port.emit();
          this.taskComplete();
        })
        .catch(err => {
          const port = this.getPort('Error');
          port.getProperty('Data').data = err;
          port.emit();
          this.taskComplete();
        })
        .done();
    });

  }

}

module.exports = Payment;