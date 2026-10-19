import { Server as HttpServer } from 'http';
import { app } from './app';
import { env } from './config/env-config';
import { DrizzleService } from './config/drizzle-setup';
import logger from './utils/logger';

class Server {
  private readonly port: number;
  private serverInstance: HttpServer | undefined;
  private readonly drizzle: DrizzleService;

  constructor(port: number) {
    this.port = port;
    this.drizzle = DrizzleService.getInstance();
  }

  public start(): void {
    this.serverInstance = app.listen(this.port, () => {
      logger.info(`server running at ${this.port}`);
    });
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Received SIGTERM, shutting down gracefully...');
    if (this.serverInstance) {
      this.serverInstance.close(() => {
        logger.info('Server closed');
      });
    }
    await this.drizzle.closeConnection();
    logger.info('Database connection closed');
    process.exit(0);
  }
}

const server = new Server(env.PORT);
server.start();
