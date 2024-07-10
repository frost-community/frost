import { controller, httpGet } from "inversify-express-utils";

@controller('/')
export class RootController {
  @httpGet('/')
  get() {
    return 'frost api';
  }
}
