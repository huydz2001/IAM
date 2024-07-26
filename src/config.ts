import 'dotenv/config';

export default {
  app: {
    port: process.env.PORT,
    appEnv: process.env.APP_ENV,
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    exchange: process.env.RABBITMQ_EXCHANGE,
    queueName: process.env.RABBITMQ_QUEUE_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  database: {
    hostRead: process.env.POSTGRES_HOST_READ,
    hostWrite: process.env.POSTGRES_HOST_WRITE,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
  },
};
