const TYPES = {
  App: Symbol.for('App'),
  Container: Symbol.for('Container'),
  AppConfig: Symbol.for('AppConfig'),
  DatabaseService: Symbol.for('DatabaseService'),
  HttpServerService: Symbol.for('HttpServerService'),
  UserService: Symbol.for('UserService'),
  AccountService: Symbol.for('AccountService'),
  PasswordVerificationService: Symbol.for('PasswordVerificationService'),

  // routes
  RootRoute: Symbol.for('RootRoute'),
  EchoRoute: Symbol.for('EchoRoute'),
  UsersRoute: Symbol.for('UsersRoute'),
};

export { TYPES };
