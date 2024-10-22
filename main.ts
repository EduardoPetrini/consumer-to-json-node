import dotenv from 'dotenv';
dotenv.config();

import { Kafka, KafkaConfig, ConsumerConfig, EachMessagePayload } from 'kafkajs';
import fs from 'node:fs';
import path from 'node:path';
import { logInfo } from './utils';

const topic = process.argv[2] || process.env.KAFKA_TOPIC;
const brokers = process.env.KAFKA_BROKERS?.split(',');
const clientId = process.env.KAFKA_CLIENT_ID;
const groupId = process.env.KAFKA_GROUP_ID;

if (!topic || !brokers?.length || !clientId || !groupId) {
  logInfo(
    'Missing required parameters:\n',
    `\ttopic: ${!!topic}\n\tbrokers: ${!!brokers?.length}\n\tclientId: ${!!clientId}\n\tgroupId: ${!!groupId}`
  );

  process.exit(1);
}

const config: KafkaConfig = {
  brokers,
  clientId,
};

const consumerConfig: ConsumerConfig = {
  groupId,
};

(async () => {
  logInfo('Topic to pull:', topic);
  const kafka = new Kafka(config);

  logInfo('Configuring kafka consumer...');
  const consumer = kafka.consumer(consumerConfig);
  await consumer.connect();

  consumer.subscribe({ topic, fromBeginning: true });

  const outputFilename: string = path.join('messages', topic + '-' + new Date().toISOString().replace(/:/g, '-'));

  logInfo('Preparing the file writer:', outputFilename);

  const fileWriter = fs.createWriteStream(outputFilename);

  logInfo('Consumer done, waiting for messages...');
  consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      logInfo('Receiving...', topic, partition, message.offset, message.key?.toString());

      await new Promise((resolve, reject) => fileWriter.write(JSON.stringify({ partition, offset: message.offset, key: message.key?.toString(), value: message.value?.toString() }) + '\n', err => (err ? reject(err) : resolve(1))));
    },
  });
})();

