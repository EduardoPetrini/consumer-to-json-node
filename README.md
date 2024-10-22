# Kafka Consumer to JSON

A Node.js application written in TypeScript that consumes messages from a Kafka topic and saves them to a JSON file. Each message is stored as a new line in the output file (newline-delimited JSON format).

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Access to a Kafka broker

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=consumer-to-json
KAFKA_GROUP_ID=consumer-group-1
KAFKA_TOPIC=your-topic-name
```

### Environment Variables

- `KAFKA_BROKERS`: Comma-separated list of Kafka brokers
- `KAFKA_CLIENT_ID`: Client identifier for this consumer
- `KAFKA_GROUP_ID`: Consumer group identifier
- `KAFKA_TOPIC`: Topic to consume messages from (can be overridden via command line argument)

## Usage

Run the application using:

```bash
npx ts-node main.ts [topic-name]
```

The `topic-name` argument is optional. If not provided, the application will use the topic specified in the `.env` file.

### Output

Messages are saved to files in the `messages` directory. Each file is named using the pattern:
```
{topic-name}-{timestamp}
```

Each line in the output file contains a JSON object with the following structure:
```json
{
  "partition": number,
  "offset": string,
  "key": string | null,
  "value": string | null
}
```

## Project Structure

- `main.ts` - Main application file containing Kafka consumer logic
- `utils.ts` - Utility functions for logging
- `package.json` - Project dependencies and configuration
- `.env` - Environment variables configuration

## Dependencies

- `kafkajs` - Kafka client for Node.js
- `dotenv` - Environment variables management
- `typescript` - TypeScript language support
- `ts-node` - TypeScript execution environment

## Development

To modify the project:

1. Install development dependencies:
```bash
npm install --save-dev typescript ts-node
```

2. Make your changes to the TypeScript files
3. Run the application using `npx ts-node main.ts`

## Error Handling

The application will exit with code 1 if any required configuration parameters are missing. Required parameters are:
- Kafka brokers
- Client ID
- Group ID
- Topic name

## Logging

The application uses a simple logging utility that includes timestamps. All logs are written to stdout with the format:
```
{timestamp} [INFO] {message}
```
