/**
 * Project Zod Schemas
 *
 * Schemas for project management operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * Project repo reference schema
 */
export const ProjectRepoSchema = z.object({
  repoId: z.string(),
  isDefault: z.boolean().optional(),
  addedAt: z.string().optional(),
});

export type ProjectRepo = z.infer<typeof ProjectRepoSchema>;

/**
 * Project mission reference schema
 */
export const ProjectMissionSchema = z.object({
  missionId: z.string(),
  addedAt: z.string().optional(),
});

export type ProjectMission = z.infer<typeof ProjectMissionSchema>;

/**
 * Project schema
 */
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  repos: z.array(ProjectRepoSchema).optional(),
  missions: z.array(ProjectMissionSchema).optional(),
  defaultRepoId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

/**
 * List projects response data schema
 */
export const ListProjectsDataSchema = z.object({
  projects: z.array(ProjectSchema),
  total: z.number().optional(),
});

export type ListProjectsData = z.infer<typeof ListProjectsDataSchema>;

/**
 * List projects response schema
 */
export const ListProjectsResponseSchema = createResponseSchema(ListProjectsDataSchema);

export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

/**
 * Create project response data schema
 */
export const CreateProjectDataSchema = z.object({
  projectId: z.string(),
  project: ProjectSchema.optional(),
});

export type CreateProjectData = z.infer<typeof CreateProjectDataSchema>;

/**
 * Create project response schema
 */
export const CreateProjectResponseSchema = createResponseSchema(CreateProjectDataSchema);

export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

/**
 * Get project response data schema
 */
export const GetProjectDataSchema = ProjectSchema;

export type GetProjectData = z.infer<typeof GetProjectDataSchema>;

/**
 * Get project response schema
 */
export const GetProjectResponseSchema = createResponseSchema(GetProjectDataSchema);

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;

/**
 * Update project response data schema
 */
export const UpdateProjectDataSchema = z.object({
  projectId: z.string(),
  project: ProjectSchema.optional(),
});

export type UpdateProjectData = z.infer<typeof UpdateProjectDataSchema>;

/**
 * Update project response schema
 */
export const UpdateProjectResponseSchema = createResponseSchema(UpdateProjectDataSchema);

export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

/**
 * Delete project response data schema
 */
export const DeleteProjectDataSchema = z.object({
  projectId: z.string(),
  deleted: z.boolean(),
});

export type DeleteProjectData = z.infer<typeof DeleteProjectDataSchema>;

/**
 * Delete project response schema
 */
export const DeleteProjectResponseSchema = createResponseSchema(DeleteProjectDataSchema);

export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

/**
 * Add project repo response data schema
 */
export const AddProjectRepoDataSchema = z.object({
  projectId: z.string(),
  repoId: z.string(),
});

export type AddProjectRepoData = z.infer<typeof AddProjectRepoDataSchema>;

/**
 * Add project repo response schema
 */
export const AddProjectRepoResponseSchema = createResponseSchema(AddProjectRepoDataSchema);

export type AddProjectRepoResponse = z.infer<typeof AddProjectRepoResponseSchema>;

/**
 * Context repos response data schema
 */
export const ContextReposDataSchema = z.object({
  repos: z.array(
    z.object({
      repoId: z.string(),
      name: z.string().optional(),
      isDefault: z.boolean().optional(),
    })
  ),
});

export type ContextReposData = z.infer<typeof ContextReposDataSchema>;

/**
 * Context repos response schema
 */
export const ContextReposResponseSchema = createResponseSchema(ContextReposDataSchema);

export type ContextReposResponse = z.infer<typeof ContextReposResponseSchema>;
