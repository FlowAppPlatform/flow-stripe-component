import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

export default class CancelSubscription extends Component {
  constructor() {
    super();
    this.name = 'cancel-subscription';

    const secret_key = new Property('secret_key', 'text');
    const subscription = new Property('subscription', 'text');

    secret_key.required = true;
    subscription.required = true;

    this.addProperty(secret_key);
    this.addProperty(subscription);

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
      ).cancelSubscription(this.getProperty('subscription').data);
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
