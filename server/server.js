const app = require('./app');
const connectDB = require('./database/connectDB');
const env = require('./config/env');

async function bootstrap() {
  await connectDB();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`[server] ${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('[server] Unhandled rejection:', reason);
    server.close(() => process.exit(1));
  });
}

bootstrap();
