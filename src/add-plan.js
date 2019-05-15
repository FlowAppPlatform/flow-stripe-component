import { Component, Port, Property } from 'flow-platform-sdk';
import Stripe from './stripe';

export default class AddPlan extends Component {
  constructor() {
    super();
    this.name = "add-plan";

    const secret_key = new Property('secret_key', 'text');
    const plan_amount = new Property('plan_amount', 'number');
    const plan_interval = new Property('plan_interval', 'text');
    const plan_name = new Property('plan_name', 'text');
    const plan_currency = new Property('plan_currency', 'text');
    const trial_period_days = new Property('trial_period_days', 'number');

    secret_key.required = true;
    plan_amount.required = true;
    plan_interval.required  = true;
    plan_name.required = true;
    plan_currency.required = true;

    this.addProperty(secret_key);
    this.addProperty(plan_amount);
    this.addProperty(plan_interval);
    this.addProperty(plan_name);
    this.addProperty(plan_currency);
    this.addProperty(trial_period_days);

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
        this.getProperty('secret_key').data
      ).addPlan(
        this.getProperty('plan_amount').data,
        this.getProperty('plan_interval').data,
        this.getProperty('plan_name').data,
        this.getProperty('plan_currency').data,
        this.getProperty('trial_period_days') 
        &&  this.getProperty('trial_period_days').data
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
