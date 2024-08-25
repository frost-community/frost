import { operations } from '../../generated/schema';

// EchoGet
export type EchoGetParams = NonNullable<operations['EchoGet']['parameters']['query']>;
export type EchoGetResult = operations['EchoGet']['responses']['200']['content']['application/json'];

// EchoPost
export type EchoPostParams = NonNullable<operations['EchoPost']['requestBody']['content']['application/json']>;
export type EchoPostResult = operations['EchoPost']['responses']['200']['content']['application/json'];

// GetPost
export type GetPostParams = NonNullable<operations['GetPost']['parameters']['query']>;
export type GetPostResult = operations['GetPost']['responses']['200']['content']['application/json'];

// CreateTimelinePost
export type CreateTimelinePostParams = NonNullable<operations['CreateTimelinePost']['requestBody']['content']['application/json']>;
export type CreateTimelinePostResult = operations['CreateTimelinePost']['responses']['200']['content']['application/json'];

// DeletePost
export type DeletePostParams = NonNullable<operations['DeletePost']['parameters']['query']>;

// Signin
export type SigninParams = NonNullable<operations['Signin']['requestBody']['content']['application/json']>;
export type SigninResult = operations['Signin']['responses']['200']['content']['application/json'];

// Signup
export type SignupParams = NonNullable<operations['Signup']['requestBody']['content']['application/json']>;
export type SignupResult = operations['Signup']['responses']['200']['content']['application/json'];

// GetUser
export type GetUserParams = NonNullable<operations['GetUser']['parameters']['query']>;
export type GetUserResult = operations['GetUser']['responses']['200']['content']['application/json'];

// DeleteUser
export type DeleteUserParams = NonNullable<operations['DeleteUser']['parameters']['query']>;
