import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

export default class DeletePlan extends Component {
  constructor() {
    super();
    this.name = "delete-plan";

    const secret_key = new Property('secret_key', 'text');
    const plan_id = new Property('plan', 'text');

    secret_key.required = true;
    plan_id.required = true;

    this.addProperty(secret_key);
    this.addProperty(plan_id);

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
      ).deletePlan(
        this.getProperty('plan').data,
      );
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
