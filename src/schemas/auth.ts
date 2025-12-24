/**
 * Auth Zod Schemas
 *
 * Schemas for authentication and authorization operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * Auth token response data schema
 */
export const AuthTokenDataSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional().default('Bearer'),
  expiresIn: z.number().optional(),
  expiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  scope: z.string().optional(),
});

export type AuthTokenData = z.infer<typeof AuthTokenDataSchema>;

/**
 * Auth token response schema
 */
export const AuthTokenResponseSchema = createResponseSchema(AuthTokenDataSchema);

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

/**
 * Auth user info schema
 */
export const AuthUserInfoSchema = z.object({
  userId: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AuthUserInfo = z.infer<typeof AuthUserInfoSchema>;

/**
 * Auth user info response schema
 */
export const AuthUserInfoResponseSchema = createResponseSchema(AuthUserInfoSchema);

export type AuthUserInfoResponse = z.infer<typeof AuthUserInfoResponseSchema>;

/**
 * Auth validate response data schema
 */
export const AuthValidateDataSchema = z.object({
  valid: z.boolean(),
  userId: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type AuthValidateData = z.infer<typeof AuthValidateDataSchema>;

/**
 * Auth validate response schema
 */
export const AuthValidateResponseSchema = createResponseSchema(AuthValidateDataSchema);

export type AuthValidateResponse = z.infer<typeof AuthValidateResponseSchema>;
