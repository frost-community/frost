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

// CreateTimelinePost
export type CreateTimelinePostBody = NonNullable<operations['CreateTimelinePost']['requestBody']['content']['application/json']>;
export type CreateTimelinePostResponse = operations['CreateTimelinePost']['responses']['200']['content']['application/json'];

// GetPost
export type GetPostQuery = NonNullable<operations['GetPost']['parameters']['query']>;
export type GetPostResponse = operations['GetPost']['responses']['200']['content']['application/json'];

// DeletePost
export type DeletePostQuery = NonNullable<operations['DeletePost']['parameters']['query']>;
