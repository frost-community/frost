import { HttpServerService } from './services/HttpServerService';

export class App {
  static async create() {
    const instance = new App();
    throw new Error('debug');
    return instance;
  }

  async listen(port: number): Promise<void> {
    // listen http server
    const http = new HttpServerService();
    await http.listen(port);
  }
}
