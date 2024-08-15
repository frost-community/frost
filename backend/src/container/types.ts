const TYPES = {
  Container: Symbol.for('Container'),

  App: Symbol.for('App'),
  AppConfig: Symbol.for('AppConfig'),
  RouteService: Symbol.for('RouteService'),
  DatabaseService: Symbol.for('DatabaseService'),
  HttpServerService: Symbol.for('HttpServerService'),
  UserService: Symbol.for('UserService'),
  AccountService: Symbol.for('AccountService'),
  PasswordVerificationService: Symbol.for('PasswordVerificationService'),

  // routers
  RootRouter: Symbol.for('RootRouter'),
  ApiVer1Router: Symbol.for('ApiVer1Router'),
};

export { TYPES };
