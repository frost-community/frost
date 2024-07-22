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
  AccountsRoute: Symbol.for('AccountsRoute'),
  EchoRoute: Symbol.for('EchoRoute'),
  MeRoute: Symbol.for('MeRoute'),
  UsersRoute: Symbol.for('UsersRoute'),
};

export { TYPES };
