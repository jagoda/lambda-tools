const Docker = require('dockerode');
const path = require('path');
const sinon = require('sinon');
const test = require('ava');

const { useNewContainer, useLambda } = require('../src/lambda');

let createContainer = null;

test.before((test) => {
  createContainer = sinon.spy(Docker.prototype, 'createContainer');
});

useLambda(test);

useNewContainer({
  environment: {
    'OTHER_VARIABLE': 2,
    'TEST_PARAMETER': 'test value'
  },
  handler: 'bundled_service.handler',
  mountpoint: path.join(__dirname, 'fixtures')
});

test.always.after((test) => {
  createContainer.restore();
});

test('Managed containers can use a custom environment', async (test) => {
  const response = await test.context.lambda.get('/');
  test.is(response.status, 200);
  test.is(response.data.parameter, 'test value');

  sinon.assert.calledWithExactly(
    createContainer,
    sinon.match({
      Env: [
        'OTHER_VARIABLE=2',
        'TEST_PARAMETER=test value'
      ]
    })
  );
});
