# @ocxp/client

TypeScript client for the OCXP (Open Context Exchange Protocol).

This package is auto-generated from the OpenAPI specification and provides type-safe access to the OCXP API.

## Installation

```bash
npm install @ocxp/client
```

## Usage

```typescript
import { Client } from '@ocxp/client';

// Create a client instance
const client = new Client({
  baseUrl: 'http://localhost:8000'
});

// Example: List projects
const { data: projects } = await client.GET('/ocxp/project');
console.log(projects);

// Example: Get a specific project
const { data: project } = await client.GET('/ocxp/project/{project_id}', {
  params: {
    path: {
      project_id: 'my-project-id'
    }
  }
});

// Example: Create a new mission
const { data: mission } = await client.POST('/ocxp/mission', {
  body: {
    name: 'My Mission',
    description: 'Mission description',
    project_id: 'my-project-id'
  }
});
```

## Features

- **Type-safe**: Full TypeScript support with auto-generated types from OpenAPI spec
- **Zod validation**: Runtime type validation using Zod schemas
- **Fetch-based**: Uses modern Fetch API for HTTP requests
- **Tree-shakeable**: ESM and CJS bundles for optimal bundle size

## API Coverage

The client provides access to all OCXP API endpoints:

- **Projects**: Create, list, update, and delete projects
- **Missions**: Manage missions and their lifecycle
- **Context**: Store and retrieve context documents
- **Memos**: Add feedback and annotations to documents
- **Repositories**: Connect and manage code repositories
- **Databases**: Configure database connections

## Documentation

For full API documentation, see the [OpenAPI specification](openapi.json) included in this package.

## Development

This package is auto-generated using [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts).

### Regenerating the Client

If you need to regenerate the client from an updated OpenAPI spec:

```bash
npm run generate
npm run build
```

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## License

MIT

## Contributing

This is an auto-generated package. Please report issues or suggest improvements to the OCXP OpenAPI specification.

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/OCXP/client-ts/issues).
