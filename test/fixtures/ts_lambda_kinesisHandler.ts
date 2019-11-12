import {Kinesis} from 'aws-sdk';
import {KinesisStreamEvent} from 'aws-lambda';

export async function handler (event: KinesisStreamEvent, context: {}) {
  const kinesis = new Kinesis({ endpoint: process.env.KINESIS_ENDPOINT });
  console.log(`Handling ${event.Records.length} records`);
  const records: Kinesis.PutRecordsRequestEntryList = event.Records.map(({kinesis: {data, partitionKey}}) => ({
    Data: Buffer.from(Buffer.from(data, 'base64').toString()),
    PartitionKey: partitionKey
  }));
  const result = await kinesis.putRecords({
    StreamName: process.env.NEXT_KINESIS_STREAM_NAME,
    Records: records
  }).promise();
  console.log(JSON.stringify({result}, null, 2));
}
