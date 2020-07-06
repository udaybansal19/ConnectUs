const { expect } = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect']);

// expose variables
before (async function () {
  global.expect = expect;
});

// close browser and reset global variables
after (function () {
  global.expect = globalVariables.expect;
});