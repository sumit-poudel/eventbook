import { app } from './app';
import { env } from './config/env-config';

class Server {
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
  }

  public start(): void {
    app.listen(this.port, () => {
      console.log('server running at ', this.port);
    });
  }
}

const server = new Server(env.PORT);
server.start();
