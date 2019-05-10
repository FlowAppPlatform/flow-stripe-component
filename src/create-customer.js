import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

export default class CreateCustomer extends Component {
  constructor() {
    super();
    this.name = 'create-customer';

    const secret_key = new Property('secret_key', 'text');
    const card_number = new Property('card_number', 'number');
    const cvc = new Property('cvc', 'number');
    const exp_month = new Property('exp_month', 'number');
    const exp_year = new Property('exp_year', 'number');

    secret_key.required = true;
    card_number.required = true;
    cvc.required = true;
    exp_month.required = true;
    exp_year.required = true;

    this.addProperty(secret_key);
    this.addProperty(card_number);
    this.addProperty(cvc);
    this.addProperty(exp_month);
    this.addProperty(exp_year);

    const success = new Port('Success');
    const error = new Port('Error');

    const response = new Property('Data', 'object');
    const generalError = new Property('Data', 'object');

    response.required = true;
    generalError.required = true;

    success.addProperty(response);
    error.addProperty(generalError);

    this.addPort(success);
    this.addPort(error);

    this.attachTask(() => {
      let task = new Stripe(
        this.getProperty('secret_key').data,
        this.getProperty('card_number').data,
        this.getProperty('cvc').data,
        this.getProperty('exp_month').data,
        this.getProperty('exp_year').data
      ).createCustomer();
      if (task instanceof Error) {
        const port = this.getPort('Error');
        port.getProperty('Data').data = task;

        port.emit();
        this.taskComplete();
        return;
      }
      task
        .then((resp) => {
          const port = this.getPort('Success');
          port.getProperty('Data').data = resp;

          port.emit();
          this.taskComplete();
        })
        .catch((err) => {
          const port = this.getPort('Error');
          port.getProperty('Data').data = err;

          port.emit();
          this.taskComplete();
        });
    });
  }
}
