/**
 * MSW Request Handlers
 *
 * Mock handlers for OCXP API endpoints.
 */

import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://api.test.ocxp.io';

/**
 * Create a standard OCXP response wrapper
 */
function ocxpResponse<T>(data: T, success = true) {
  return {
    success,
    data,
    meta: {
      requestId: `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMs: 42,
      operation: 'test',
    },
  };
}

/**
 * Create an error response
 */
function errorResponse(code: string, message: string, status = 400) {
  return HttpResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      meta: {
        requestId: `req-${Date.now()}`,
        timestamp: new Date().toISOString(),
        durationMs: 1,
        operation: 'test',
      },
    },
    { status }
  );
}

/**
 * Mock data
 */
export const mockData = {
  contentTypes: [
    { name: 'mission', description: 'Mission files', prefix: null },
    { name: 'project', description: 'Project files', prefix: null },
    { name: 'context', description: 'Context files', prefix: null },
    { name: 'sop', description: 'SOP files', prefix: null },
    { name: 'repo', description: 'Repository files', prefix: null },
    { name: 'artifact', description: 'Artifacts', prefix: null },
    { name: 'kb', description: 'Knowledge base', prefix: null },
    { name: 'docs', description: 'Documentation', prefix: null },
  ],

  missions: [
    {
      name: 'test-mission.md',
      type: 'file' as const,
      path: 'mission/test-mission.md',
      size: 1024,
      mtime: '2024-01-15T12:00:00Z',
    },
    {
      name: 'another-mission.md',
      type: 'file' as const,
      path: 'mission/another-mission.md',
      size: 2048,
      mtime: '2024-01-16T14:00:00Z',
    },
  ],

  missionContent: {
    content: '# Test Mission\n\nThis is a test mission.',
    size: 40,
    mtime: '2024-01-15T12:00:00Z',
    encoding: 'utf-8',
  },

  projects: [
    {
      id: 'proj-1',
      name: 'Test Project',
      description: 'A test project',
      createdAt: '2024-01-01T00:00:00Z',
      repos: [],
      missions: [],
    },
  ],

  sessions: [
    {
      id: 'sess-1',
      missionId: 'mission-1',
      title: 'Test Session',
      createdAt: '2024-01-15T12:00:00Z',
      messageCount: 5,
    },
  ],
};

/**
 * Default request handlers
 */
export const handlers = [
  // Content Types
  http.get(`${BASE_URL}/content/types`, () => {
    return HttpResponse.json(ocxpResponse({ types: mockData.contentTypes }));
  }),

  // List Content
  http.get(`${BASE_URL}/content/:type`, ({ params }) => {
    const { type } = params;
    if (type === 'mission') {
      return HttpResponse.json(
        ocxpResponse({
          entries: mockData.missions,
          hasMore: false,
          total: mockData.missions.length,
        })
      );
    }
    return HttpResponse.json(ocxpResponse({ entries: [], hasMore: false, total: 0 }));
  }),

  // Read Content
  http.get(`${BASE_URL}/content/:type/:path`, ({ params }) => {
    const { type, path } = params;
    if (type === 'mission' && path === 'test-mission.md') {
      return HttpResponse.json(ocxpResponse(mockData.missionContent));
    }
    return errorResponse('NOT_FOUND', 'Content not found', 404);
  }),

  // Write Content
  http.put(`${BASE_URL}/content/:type/:path`, async ({ params, request }) => {
    const { type, path } = params;
    const body = (await request.json()) as { content: string };
    return HttpResponse.json(
      ocxpResponse({
        path: `${type}/${path}`,
        size: body.content?.length || 0,
        etag: `etag-${Date.now()}`,
      }),
      { status: 201 }
    );
  }),

  // Delete Content
  http.delete(`${BASE_URL}/content/:type/:path`, ({ params }) => {
    const { type, path } = params;
    return HttpResponse.json(
      ocxpResponse({
        path: `${type}/${path}`,
        deleted: true,
      })
    );
  }),

  // Projects
  http.get(`${BASE_URL}/projects`, () => {
    return HttpResponse.json(
      ocxpResponse({
        projects: mockData.projects,
        total: mockData.projects.length,
      })
    );
  }),

  http.post(`${BASE_URL}/projects`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string };
    const newProject = {
      id: `proj-${Date.now()}`,
      name: body.name,
      description: body.description,
      createdAt: new Date().toISOString(),
      repos: [],
      missions: [],
    };
    return HttpResponse.json(
      ocxpResponse({
        projectId: newProject.id,
        project: newProject,
      }),
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/projects/:id`, ({ params }) => {
    const { id } = params;
    const project = mockData.projects.find((p) => p.id === id);
    if (project) {
      return HttpResponse.json(ocxpResponse(project));
    }
    return errorResponse('NOT_FOUND', 'Project not found', 404);
  }),

  http.delete(`${BASE_URL}/projects/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      ocxpResponse({
        projectId: id,
        deleted: true,
      })
    );
  }),

  // Sessions
  http.get(`${BASE_URL}/sessions`, () => {
    return HttpResponse.json(
      ocxpResponse({
        sessions: mockData.sessions,
        total: mockData.sessions.length,
      })
    );
  }),

  http.post(`${BASE_URL}/sessions`, async ({ request }) => {
    const body = (await request.json()) as { missionId?: string };
    return HttpResponse.json(
      ocxpResponse({
        sessionId: `sess-${Date.now()}`,
        missionId: body.missionId,
      }),
      { status: 201 }
    );
  }),

  // Auth
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email && body.password) {
      return HttpResponse.json(
        ocxpResponse({
          accessToken: 'test-access-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
        })
      );
    }
    return errorResponse('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  }),

  // Error simulation endpoint
  http.get(`${BASE_URL}/error/:code`, ({ params }) => {
    const { code } = params;
    switch (code) {
      case '400':
        return errorResponse('BAD_REQUEST', 'Bad request', 400);
      case '401':
        return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);
      case '403':
        return errorResponse('FORBIDDEN', 'Forbidden', 403);
      case '404':
        return errorResponse('NOT_FOUND', 'Not found', 404);
      case '429':
        return errorResponse('RATE_LIMITED', 'Rate limited', 429);
      case '500':
        return errorResponse('INTERNAL_ERROR', 'Internal error', 500);
      default:
        return HttpResponse.json(ocxpResponse({ message: 'OK' }));
    }
  }),
];
