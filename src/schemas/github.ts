/**
 * GitHub Proxy Zod Schemas
 *
 * Schemas for GitHub proxy operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * GitHub file info schema
 */
export const GithubFileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  type: z.enum(['file', 'dir', 'symlink', 'submodule']),
  url: z.string().optional(),
  html_url: z.string().optional(),
  git_url: z.string().optional(),
  download_url: z.string().nullable().optional(),
  content: z.string().optional(),
  encoding: z.string().optional(),
});

export type GithubFileInfo = z.infer<typeof GithubFileInfoSchema>;

/**
 * GitHub repository info schema
 */
export const GithubRepoInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string().optional(),
    type: z.string().optional(),
  }),
  html_url: z.string(),
  description: z.string().nullable().optional(),
  fork: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  pushed_at: z.string().optional(),
  size: z.number().optional(),
  stargazers_count: z.number().optional(),
  watchers_count: z.number().optional(),
  language: z.string().nullable().optional(),
  default_branch: z.string().optional(),
  visibility: z.string().optional(),
});

export type GithubRepoInfo = z.infer<typeof GithubRepoInfoSchema>;

/**
 * GitHub branch info schema
 */
export const GithubBranchInfoSchema = z.object({
  name: z.string(),
  commit: z.object({
    sha: z.string(),
    url: z.string().optional(),
  }),
  protected: z.boolean().optional(),
});

export type GithubBranchInfo = z.infer<typeof GithubBranchInfoSchema>;

/**
 * GitHub commit info schema
 */
export const GithubCommitInfoSchema = z.object({
  sha: z.string(),
  message: z.string().optional(),
  author: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      date: z.string().optional(),
    })
    .optional(),
  committer: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      date: z.string().optional(),
    })
    .optional(),
  url: z.string().optional(),
  html_url: z.string().optional(),
});

export type GithubCommitInfo = z.infer<typeof GithubCommitInfoSchema>;

/**
 * GitHub proxy file response data schema
 */
export const GithubFileDataSchema = z.object({
  file: GithubFileInfoSchema,
  content: z.string().optional(),
  encoding: z.string().optional(),
});

export type GithubFileData = z.infer<typeof GithubFileDataSchema>;

/**
 * GitHub proxy file response schema
 */
export const GithubFileResponseSchema = createResponseSchema(GithubFileDataSchema);

export type GithubFileResponse = z.infer<typeof GithubFileResponseSchema>;

/**
 * GitHub proxy directory response data schema
 */
export const GithubDirectoryDataSchema = z.object({
  entries: z.array(GithubFileInfoSchema),
  path: z.string(),
});

export type GithubDirectoryData = z.infer<typeof GithubDirectoryDataSchema>;

/**
 * GitHub proxy directory response schema
 */
export const GithubDirectoryResponseSchema = createResponseSchema(GithubDirectoryDataSchema);

export type GithubDirectoryResponse = z.infer<typeof GithubDirectoryResponseSchema>;

/**
 * GitHub proxy repo info response data schema
 */
export const GithubRepoDataSchema = z.object({
  repository: GithubRepoInfoSchema,
});

export type GithubRepoData = z.infer<typeof GithubRepoDataSchema>;

/**
 * GitHub proxy repo info response schema
 */
export const GithubRepoResponseSchema = createResponseSchema(GithubRepoDataSchema);

export type GithubRepoResponse = z.infer<typeof GithubRepoResponseSchema>;

/**
 * GitHub proxy branches response data schema
 */
export const GithubBranchesDataSchema = z.object({
  branches: z.array(GithubBranchInfoSchema),
});

export type GithubBranchesData = z.infer<typeof GithubBranchesDataSchema>;

/**
 * GitHub proxy branches response schema
 */
export const GithubBranchesResponseSchema = createResponseSchema(GithubBranchesDataSchema);

export type GithubBranchesResponse = z.infer<typeof GithubBranchesResponseSchema>;

/**
 * GitHub proxy commits response data schema
 */
export const GithubCommitsDataSchema = z.object({
  commits: z.array(GithubCommitInfoSchema),
});

export type GithubCommitsData = z.infer<typeof GithubCommitsDataSchema>;

/**
 * GitHub proxy commits response schema
 */
export const GithubCommitsResponseSchema = createResponseSchema(GithubCommitsDataSchema);

export type GithubCommitsResponse = z.infer<typeof GithubCommitsResponseSchema>;
