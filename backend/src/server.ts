import { app } from './app';
import { env } from './config/env-config';
import { DrizzleService } from './config/drizzle-setup';
import logger from './utils/logger';

class Server {
  private readonly port: number;
  private readonly drizzle: DrizzleService;

  constructor(port: number) {
    this.port = port;
    this.drizzle = DrizzleService.getInstance();
  }

  public start(): void {
    app.listen(this.port, () => {
      logger.info(`server running at ${this.port}`);
    });
  }
}

const server = new Server(env.PORT);
server.start();
