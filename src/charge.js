import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

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

export default class Charge extends Component {
  constructor() {
    super();
    this.name = 'charge';

    const secret_key = new Property('secret_key', 'text');
    const card_number = new Property('card_number', 'text');
    const cvc = new Property('cvc', 'text');
    const expiry_month = new Property('exp_month', 'text');
    const expiry_year = new Property('exp_year', 'text');
    const currency = new Property('currency', 'text');
    const amount = new Property('amount', 'number');
    // optional properties
    const customer_id = new Property('customer_id', 'text');
    const description = new Property('description', 'text');


    secret_key.required = true;
    card_number.required = true;
    cvc.required = true;
    expiry_month.required = true;
    expiry_year.required = true;
    currency.required = true;
    amount.required = true;

    this.addProperty(secret_key);
    this.addProperty(card_number);
    this.addProperty(cvc);
    this.addProperty(expiry_month);
    this.addProperty(expiry_year);
    this.addProperty(currency);
    this.addProperty(amount);
    this.addProperty(customer_id);
    this.addProperty(description);

    const success = new Port('Success');
    const error = new Port('Error');

    const response = new Property('Data', 'object');
    response.required = true;
    success.addProperty(response);
    
    const generalError = new Property('Data', 'object');
    generalError.required = true;
    error.addProperty(generalError);
    
    this.addPort(success);
    this.addPort(error);

    // make charge here
    this.attachTask(function() {
      const task = new Stripe(
        this.getProperty('secret_key').data,
        this.getProperty('card_number').data,
        this.getProperty('cvc').data,
        this.getProperty('exp_month').data,
        this.getProperty('exp_year').data
      ).charge(
        this.getProperty('currency').data,
        this.getProperty('amount').data,
        this.getProperty('customer_id').data,
        this.getProperty('description').data
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
