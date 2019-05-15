require('@babel/register');
require('@babel/polyfill');

const AddCard = require('./src/add-card');
const AddPlan =require('./src/add-plan');
const CancelSubscription =require('./src/cancel-subscription');
const Charge =require('./src/charge');
const CreateCustomer =require('./src/create-customer');
const CreateSubscription =require('./src/create-subscription');
const DeleteCard =require('./src/delete-card');
const DeleteCustomer =require('./src/delete-customer');
const DeletePlan =require('./src/delete-plan');

module.exports = {
  AddCard,
  AddPlan,
  CancelSubscription,
  Charge,
  CreateCustomer,
  CreateSubscription,
  DeleteCard,
  DeleteCustomer,
  DeletePlan
};
