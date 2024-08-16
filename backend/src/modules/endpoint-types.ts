import { operations } from '../../generated/schema';

// Signup
export type SignupBody = NonNullable<operations['Signup']['requestBody']['content']['application/json']>;
export type SignupResponse = operations['Signup']['responses']['200']['content']['application/json'];

// Signin
export type SigninBody = NonNullable<operations['Signin']['requestBody']['content']['application/json']>;
export type SigninResponse = operations['Signin']['responses']['200']['content']['application/json'];

// GetUser
export type GetUserQuery = NonNullable<operations['GetUser']['parameters']['query']>;
export type GetUserResponse = operations['GetUser']['responses']['200']['content']['application/json'];
