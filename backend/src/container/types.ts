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
  PostService: Symbol.for('PostService'),

  // repositories
  UserRepository: Symbol.for('UserRepository'),
  PasswordVerificationRepository: Symbol.for('PasswordVerificationRepository'),
  TokenRepository: Symbol.for('TokenRepository'),
  PostRepository: Symbol.for('PostRepository'),

  // routers
  RootRouter: Symbol.for('RootRouter'),
  ApiVer1Router: Symbol.for('ApiVer1Router'),
};

export { TYPES };
