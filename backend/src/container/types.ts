const TYPES = {
  Container: Symbol.for('Container'),
  App: Symbol.for('App'),
  AppConfig: Symbol.for('AppConfig'),

  // modules
  HttpRoute: Symbol.for('HttpRoute'),
  db: Symbol.for('db'),

  // services
  UserService: Symbol.for('UserService'),
  PasswordVerificationService: Symbol.for('PasswordVerificationService'),
  TokenService: Symbol.for('TokenService'),
  LeafService: Symbol.for('LeafService'),

  // repositories
  UserRepository: Symbol.for('UserRepository'),
  PasswordVerificationRepository: Symbol.for('PasswordVerificationRepository'),
  TokenRepository: Symbol.for('TokenRepository'),
  LeafRepository: Symbol.for('LeafRepository'),

  // routers
  RootRouter: Symbol.for('RootRouter'),
  ApiVer1Router: Symbol.for('ApiVer1Router'),
};

export { TYPES };
