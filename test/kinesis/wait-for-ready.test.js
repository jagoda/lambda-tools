const test = require('ava');
const sinon = require('sinon');

const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);

// Setup a mock listTables call that will fail once
// to force a retry and then success to allow the setup
// to continue
const listStreamsMock = sinon.stub()
  .resolves({ StreamNames: [] }, [])
  .onFirstCall().rejects(new Error('First error'));

AWSMock.mock('Kinesis', 'listStreams', listStreamsMock);

const { useKinesisDocker } = require('../../src/kinesis');

useKinesisDocker(test);

test.serial('The helper provides database clients and tables', async (test) => {
  // Listing the tables should be called twice. Once for the failure and the
  // second for success to allow the `before` block to complete
  sinon.assert.calledTwice(listStreamsMock);
});
