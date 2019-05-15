import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

export default class DeleteCustomer extends Component {
  constructor() {
    super();
    this.name = 'delete-customer';

    const secret_key = new Property('secret_key', 'text');
    const customer = new Property('customer', 'text');

    secret_key.required = true;
    customer.required = true;

    this.addProperty(secret_key);
    this.addProperty(customer);

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
      const task = new Stripe(
        this.getProperty('secret_key').data,
      ).deleteCustomer(this.getProperty('customer').data);
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
