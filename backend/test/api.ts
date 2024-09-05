import assert from "assert";
import { Container } from "inversify";
import request from 'supertest';
import { setupContainer } from "../src/container/inversify.config";
import { App } from "../src/app";
import { TYPES } from "../src/container/types";

describe('api', () => {

  it('GET /api/v1/echo', async () => {
    // const container = new Container();
    // setupContainer(container);
  
    // const app = container.get<App>(TYPES.App);
    // const server = await app.run();

    // request(server)
    //   .GET('/api/v1/echo?message=123')
    //   .expect(200);
  });
});
