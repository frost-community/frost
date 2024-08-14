const TYPES = {
  App: Symbol.for('App'),
  Container: Symbol.for('Container'),
  AppConfig: Symbol.for('AppConfig'),
  DatabaseService: Symbol.for('DatabaseService'),
  HttpServerService: Symbol.for('HttpServerService'),
  UserService: Symbol.for('UserService'),
  AccountService: Symbol.for('AccountService'),
  PasswordVerificationService: Symbol.for('PasswordVerificationService'),
  FrontendRenderingService: Symbol.for('FrontendRenderingService'),

  // routers
  RootRouter: Symbol.for('RootRouter'),
  ApiVer1Router: Symbol.for('ApiVer1Router'),
};

export { TYPES };
