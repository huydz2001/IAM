export const configuration = () => ({
  port: Number(process.env.PORT),
  appEnv: process.env.APP_ENV,
  database: {
    hostRead: process.env.POSTGRES_HOST_READ,
    hostWrite: process.env.POSTGRES_HOST_WRITE,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
  },
  jwt: {
    key: process.env.JWT_KEY,
    keyExpired: process.env.JWT_KEY_EXPIRED,
    keyRefresh: process.env.JWT_KEY_REFRESH,
    keyRefreshExpired: process.env.JWT_KEY_REFRESH_EXPIRED,
  },
  rabbitmq: {
    user: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    queue: process.env.RABBITMQ_QUEUE_NAME,
    exchange: process.env.RABBITMQ_EXCHANGE,
    uri: process.env.RABBITMQ_URI,
  },
  http: {
    timeout: process.env.HTTP_TIMEOUT,
    maxRedirect: process.env.HTTP_MAX_REDIRECT,
  },
  //redis
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  iamRedis: {
    host: process.env.REDIS_IAM_HOST,
    port: Number(process.env.REDIS_IAM_PORT),
    password: process.env.REDIS_IAM_PASSWORD,
  },
  // appleUrl: process.env.APPLE_URL,
});
