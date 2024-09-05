import assert from "assert";
import e from "express";
import { Server } from "http";
import { Container } from "inversify";
import request from 'supertest';
import { AppConfig } from "../src/app";
import { setupContainer } from "../src/container/inversify.config";
import { TYPES } from "../src/container/types";
import { createHttpServer } from "../src/modules/httpServer";

function listen(app: e.Express, port: number): Promise<Server> {
  return new Promise<Server>(resolve => {
    const s = app.listen(port, () => resolve(s));
  });
}

async function setup() {
  const container = new Container();
  setupContainer(container);
  const app = await createHttpServer(container);
  const config = container.get<AppConfig>(TYPES.AppConfig);
  const server = await listen(app, config.port);

  return { server };
}

describe('api', () => {
  it('GET /api/v1/echo', async () => {
    const { server } = await setup();
    try {
      await request(server)
        .get('/api/v1/echo?message=abcxyz')
        .expect(200, { message: 'abcxyz' });
    }
    finally {
      server.close();
    }
  });

  it('POST /api/v1/echo', async () => {
    const { server } = await setup();
    try {
      await request(server)
        .post('/api/v1/echo')
        .send({ message: 'abc123' })
        .expect(200, { message: 'abc123' });
    }
    finally {
      server.close();
    }
  });
});
