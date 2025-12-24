// src/generated/core/bodySerializer.gen.ts
var jsonBodySerializer = {
  bodySerializer: (body) => JSON.stringify(body, (_key, value) => typeof value === "bigint" ? value.toString() : value)
};

// src/generated/core/serverSentEvents.gen.ts
var createSseClient = ({
  onRequest,
  onSseError,
  onSseEvent,
  responseTransformer,
  responseValidator,
  sseDefaultRetryDelay,
  sseMaxRetryAttempts,
  sseMaxRetryDelay,
  sseSleepFn,
  url,
  ...options
}) => {
  let lastEventId;
  const sleep = sseSleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const createStream = async function* () {
    let retryDelay = sseDefaultRetryDelay ?? 3e3;
    let attempt = 0;
    const signal = options.signal ?? new AbortController().signal;
    while (true) {
      if (signal.aborted) break;
      attempt++;
      const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      if (lastEventId !== void 0) {
        headers.set("Last-Event-ID", lastEventId);
      }
      try {
        const requestInit = {
          redirect: "follow",
          ...options,
          body: options.serializedBody,
          headers,
          signal
        };
        let request = new Request(url, requestInit);
        if (onRequest) {
          request = await onRequest(url, requestInit);
        }
        const _fetch = options.fetch ?? globalThis.fetch;
        const response = await _fetch(request);
        if (!response.ok) throw new Error(`SSE failed: ${response.status} ${response.statusText}`);
        if (!response.body) throw new Error("No body in SSE response");
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        const abortHandler = () => {
          try {
            reader.cancel();
          } catch {
          }
        };
        signal.addEventListener("abort", abortHandler);
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += value;
            buffer = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";
            for (const chunk of chunks) {
              const lines = chunk.split("\n");
              const dataLines = [];
              let eventName;
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  dataLines.push(line.replace(/^data:\s*/, ""));
                } else if (line.startsWith("event:")) {
                  eventName = line.replace(/^event:\s*/, "");
                } else if (line.startsWith("id:")) {
                  lastEventId = line.replace(/^id:\s*/, "");
                } else if (line.startsWith("retry:")) {
                  const parsed = Number.parseInt(line.replace(/^retry:\s*/, ""), 10);
                  if (!Number.isNaN(parsed)) {
                    retryDelay = parsed;
                  }
                }
              }
              let data;
              let parsedJson = false;
              if (dataLines.length) {
                const rawData = dataLines.join("\n");
                try {
                  data = JSON.parse(rawData);
                  parsedJson = true;
                } catch {
                  data = rawData;
                }
              }
              if (parsedJson) {
                if (responseValidator) {
                  await responseValidator(data);
                }
                if (responseTransformer) {
                  data = await responseTransformer(data);
                }
              }
              onSseEvent?.({
                data,
                event: eventName,
                id: lastEventId,
                retry: retryDelay
              });
              if (dataLines.length) {
                yield data;
              }
            }
          }
        } finally {
          signal.removeEventListener("abort", abortHandler);
          reader.releaseLock();
        }
        break;
      } catch (error) {
        onSseError?.(error);
        if (sseMaxRetryAttempts !== void 0 && attempt >= sseMaxRetryAttempts) {
          break;
        }
        const backoff = Math.min(retryDelay * 2 ** (attempt - 1), sseMaxRetryDelay ?? 3e4);
        await sleep(backoff);
      }
    }
  };
  const stream = createStream();
  return { stream };
};

// src/generated/core/pathSerializer.gen.ts
var separatorArrayExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var separatorArrayNoExplode = (style) => {
  switch (style) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
};
var separatorObjectExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var serializeArrayParam = ({
  allowReserved,
  explode,
  name,
  style,
  value
}) => {
  if (!explode) {
    const joinedValues2 = (allowReserved ? value : value.map((v) => encodeURIComponent(v))).join(separatorArrayNoExplode(style));
    switch (style) {
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      case "simple":
        return joinedValues2;
      default:
        return `${name}=${joinedValues2}`;
    }
  }
  const separator = separatorArrayExplode(style);
  const joinedValues = value.map((v) => {
    if (style === "label" || style === "simple") {
      return allowReserved ? v : encodeURIComponent(v);
    }
    return serializePrimitiveParam({
      allowReserved,
      name,
      value: v
    });
  }).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};
var serializePrimitiveParam = ({
  allowReserved,
  name,
  value
}) => {
  if (value === void 0 || value === null) {
    return "";
  }
  if (typeof value === "object") {
    throw new Error(
      "Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these."
    );
  }
  return `${name}=${allowReserved ? value : encodeURIComponent(value)}`;
};
var serializeObjectParam = ({
  allowReserved,
  explode,
  name,
  style,
  value,
  valueOnly
}) => {
  if (value instanceof Date) {
    return valueOnly ? value.toISOString() : `${name}=${value.toISOString()}`;
  }
  if (style !== "deepObject" && !explode) {
    let values = [];
    Object.entries(value).forEach(([key, v]) => {
      values = [...values, key, allowReserved ? v : encodeURIComponent(v)];
    });
    const joinedValues2 = values.join(",");
    switch (style) {
      case "form":
        return `${name}=${joinedValues2}`;
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      default:
        return joinedValues2;
    }
  }
  const separator = separatorObjectExplode(style);
  const joinedValues = Object.entries(value).map(
    ([key, v]) => serializePrimitiveParam({
      allowReserved,
      name: style === "deepObject" ? `${name}[${key}]` : key,
      value: v
    })
  ).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};

// src/generated/core/utils.gen.ts
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var defaultPathSerializer = ({ path, url: _url }) => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style = "simple";
      if (name.endsWith("*")) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }
      if (name.startsWith(".")) {
        name = name.substring(1);
        style = "label";
      } else if (name.startsWith(";")) {
        name = name.substring(1);
        style = "matrix";
      }
      const value = path[name];
      if (value === void 0 || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value }));
        continue;
      }
      if (typeof value === "object") {
        url = url.replace(
          match,
          serializeObjectParam({
            explode,
            name,
            style,
            value,
            valueOnly: true
          })
        );
        continue;
      }
      if (style === "matrix") {
        url = url.replace(
          match,
          `;${serializePrimitiveParam({
            name,
            value
          })}`
        );
        continue;
      }
      const replaceValue = encodeURIComponent(
        style === "label" ? `.${value}` : value
      );
      url = url.replace(match, replaceValue);
    }
  }
  return url;
};
var getUrl = ({
  baseUrl,
  path,
  query,
  querySerializer,
  url: _url
}) => {
  const pathUrl = _url.startsWith("/") ? _url : `/${_url}`;
  let url = (baseUrl ?? "") + pathUrl;
  if (path) {
    url = defaultPathSerializer({ path, url });
  }
  let search = query ? querySerializer(query) : "";
  if (search.startsWith("?")) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
};
function getValidRequestBody(options) {
  const hasBody = options.body !== void 0;
  const isSerializedBody = hasBody && options.bodySerializer;
  if (isSerializedBody) {
    if ("serializedBody" in options) {
      const hasSerializedBody = options.serializedBody !== void 0 && options.serializedBody !== "";
      return hasSerializedBody ? options.serializedBody : null;
    }
    return options.body !== "" ? options.body : null;
  }
  if (hasBody) {
    return options.body;
  }
  return void 0;
}

// src/generated/core/auth.gen.ts
var getAuthToken = async (auth, callback) => {
  const token = typeof callback === "function" ? await callback(auth) : callback;
  if (!token) {
    return;
  }
  if (auth.scheme === "bearer") {
    return `Bearer ${token}`;
  }
  if (auth.scheme === "basic") {
    return `Basic ${btoa(token)}`;
  }
  return token;
};

// src/generated/client/utils.gen.ts
var createQuerySerializer = ({
  parameters = {},
  ...args
} = {}) => {
  const querySerializer = (queryParams) => {
    const search = [];
    if (queryParams && typeof queryParams === "object") {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === void 0 || value === null) {
          continue;
        }
        const options = parameters[name] || args;
        if (Array.isArray(value)) {
          const serializedArray = serializeArrayParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "form",
            value,
            ...options.array
          });
          if (serializedArray) search.push(serializedArray);
        } else if (typeof value === "object") {
          const serializedObject = serializeObjectParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "deepObject",
            value,
            ...options.object
          });
          if (serializedObject) search.push(serializedObject);
        } else {
          const serializedPrimitive = serializePrimitiveParam({
            allowReserved: options.allowReserved,
            name,
            value
          });
          if (serializedPrimitive) search.push(serializedPrimitive);
        }
      }
    }
    return search.join("&");
  };
  return querySerializer;
};
var getParseAs = (contentType) => {
  if (!contentType) {
    return "stream";
  }
  const cleanContent = contentType.split(";")[0]?.trim();
  if (!cleanContent) {
    return;
  }
  if (cleanContent.startsWith("application/json") || cleanContent.endsWith("+json")) {
    return "json";
  }
  if (cleanContent === "multipart/form-data") {
    return "formData";
  }
  if (["application/", "audio/", "image/", "video/"].some((type) => cleanContent.startsWith(type))) {
    return "blob";
  }
  if (cleanContent.startsWith("text/")) {
    return "text";
  }
  return;
};
var checkForExistence = (options, name) => {
  if (!name) {
    return false;
  }
  if (options.headers.has(name) || options.query?.[name] || options.headers.get("Cookie")?.includes(`${name}=`)) {
    return true;
  }
  return false;
};
var setAuthParams = async ({
  security,
  ...options
}) => {
  for (const auth of security) {
    if (checkForExistence(options, auth.name)) {
      continue;
    }
    const token = await getAuthToken(auth, options.auth);
    if (!token) {
      continue;
    }
    const name = auth.name ?? "Authorization";
    switch (auth.in) {
      case "query":
        if (!options.query) {
          options.query = {};
        }
        options.query[name] = token;
        break;
      case "cookie":
        options.headers.append("Cookie", `${name}=${token}`);
        break;
      case "header":
      default:
        options.headers.set(name, token);
        break;
    }
  }
};
var buildUrl = (options) => getUrl({
  baseUrl: options.baseUrl,
  path: options.path,
  query: options.query,
  querySerializer: typeof options.querySerializer === "function" ? options.querySerializer : createQuerySerializer(options.querySerializer),
  url: options.url
});
var mergeConfigs = (a, b) => {
  const config = { ...a, ...b };
  if (config.baseUrl?.endsWith("/")) {
    config.baseUrl = config.baseUrl.substring(0, config.baseUrl.length - 1);
  }
  config.headers = mergeHeaders(a.headers, b.headers);
  return config;
};
var headersEntries = (headers) => {
  const entries = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
};
var mergeHeaders = (...headers) => {
  const mergedHeaders = new Headers();
  for (const header of headers) {
    if (!header) {
      continue;
    }
    const iterator = header instanceof Headers ? headersEntries(header) : Object.entries(header);
    for (const [key, value] of iterator) {
      if (value === null) {
        mergedHeaders.delete(key);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          mergedHeaders.append(key, v);
        }
      } else if (value !== void 0) {
        mergedHeaders.set(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }
    }
  }
  return mergedHeaders;
};
var Interceptors = class {
  fns = [];
  clear() {
    this.fns = [];
  }
  eject(id) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = null;
    }
  }
  exists(id) {
    const index = this.getInterceptorIndex(id);
    return Boolean(this.fns[index]);
  }
  getInterceptorIndex(id) {
    if (typeof id === "number") {
      return this.fns[id] ? id : -1;
    }
    return this.fns.indexOf(id);
  }
  update(id, fn) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = fn;
      return id;
    }
    return false;
  }
  use(fn) {
    this.fns.push(fn);
    return this.fns.length - 1;
  }
};
var createInterceptors = () => ({
  error: new Interceptors(),
  request: new Interceptors(),
  response: new Interceptors()
});
var defaultQuerySerializer = createQuerySerializer({
  allowReserved: false,
  array: {
    explode: true,
    style: "form"
  },
  object: {
    explode: true,
    style: "deepObject"
  }
});
var defaultHeaders = {
  "Content-Type": "application/json"
};
var createConfig = (override = {}) => ({
  ...jsonBodySerializer,
  headers: defaultHeaders,
  parseAs: "auto",
  querySerializer: defaultQuerySerializer,
  ...override
});

// src/generated/client/client.gen.ts
var createClient = (config = {}) => {
  let _config = mergeConfigs(createConfig(), config);
  const getConfig = () => ({ ..._config });
  const setConfig = (config2) => {
    _config = mergeConfigs(_config, config2);
    return getConfig();
  };
  const interceptors = createInterceptors();
  const beforeRequest = async (options) => {
    const opts = {
      ..._config,
      ...options,
      fetch: options.fetch ?? _config.fetch ?? globalThis.fetch,
      headers: mergeHeaders(_config.headers, options.headers),
      serializedBody: void 0
    };
    if (opts.security) {
      await setAuthParams({
        ...opts,
        security: opts.security
      });
    }
    if (opts.requestValidator) {
      await opts.requestValidator(opts);
    }
    if (opts.body !== void 0 && opts.bodySerializer) {
      opts.serializedBody = opts.bodySerializer(opts.body);
    }
    if (opts.body === void 0 || opts.serializedBody === "") {
      opts.headers.delete("Content-Type");
    }
    const url = buildUrl(opts);
    return { opts, url };
  };
  const request = async (options) => {
    const { opts, url } = await beforeRequest(options);
    const requestInit = {
      redirect: "follow",
      ...opts,
      body: getValidRequestBody(opts)
    };
    let request2 = new Request(url, requestInit);
    for (const fn of interceptors.request.fns) {
      if (fn) {
        request2 = await fn(request2, opts);
      }
    }
    const _fetch = opts.fetch;
    let response;
    try {
      response = await _fetch(request2);
    } catch (error2) {
      let finalError2 = error2;
      for (const fn of interceptors.error.fns) {
        if (fn) {
          finalError2 = await fn(error2, void 0, request2, opts);
        }
      }
      finalError2 = finalError2 || {};
      if (opts.throwOnError) {
        throw finalError2;
      }
      return opts.responseStyle === "data" ? void 0 : {
        error: finalError2,
        request: request2,
        response: void 0
      };
    }
    for (const fn of interceptors.response.fns) {
      if (fn) {
        response = await fn(response, request2, opts);
      }
    }
    const result = {
      request: request2,
      response
    };
    if (response.ok) {
      const parseAs = (opts.parseAs === "auto" ? getParseAs(response.headers.get("Content-Type")) : opts.parseAs) ?? "json";
      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        let emptyData;
        switch (parseAs) {
          case "arrayBuffer":
          case "blob":
          case "text":
            emptyData = await response[parseAs]();
            break;
          case "formData":
            emptyData = new FormData();
            break;
          case "stream":
            emptyData = response.body;
            break;
          case "json":
          default:
            emptyData = {};
            break;
        }
        return opts.responseStyle === "data" ? emptyData : {
          data: emptyData,
          ...result
        };
      }
      let data;
      switch (parseAs) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          data = await response[parseAs]();
          break;
        case "stream":
          return opts.responseStyle === "data" ? response.body : {
            data: response.body,
            ...result
          };
      }
      if (parseAs === "json") {
        if (opts.responseValidator) {
          await opts.responseValidator(data);
        }
        if (opts.responseTransformer) {
          data = await opts.responseTransformer(data);
        }
      }
      return opts.responseStyle === "data" ? data : {
        data,
        ...result
      };
    }
    const textError = await response.text();
    let jsonError;
    try {
      jsonError = JSON.parse(textError);
    } catch {
    }
    const error = jsonError ?? textError;
    let finalError = error;
    for (const fn of interceptors.error.fns) {
      if (fn) {
        finalError = await fn(error, response, request2, opts);
      }
    }
    finalError = finalError || {};
    if (opts.throwOnError) {
      throw finalError;
    }
    return opts.responseStyle === "data" ? void 0 : {
      error: finalError,
      ...result
    };
  };
  const makeMethodFn = (method) => (options) => request({ ...options, method });
  const makeSseFn = (method) => async (options) => {
    const { opts, url } = await beforeRequest(options);
    return createSseClient({
      ...opts,
      body: opts.body,
      headers: opts.headers,
      method,
      onRequest: async (url2, init) => {
        let request2 = new Request(url2, init);
        for (const fn of interceptors.request.fns) {
          if (fn) {
            request2 = await fn(request2, opts);
          }
        }
        return request2;
      },
      url
    });
  };
  return {
    buildUrl,
    connect: makeMethodFn("CONNECT"),
    delete: makeMethodFn("DELETE"),
    get: makeMethodFn("GET"),
    getConfig,
    head: makeMethodFn("HEAD"),
    interceptors,
    options: makeMethodFn("OPTIONS"),
    patch: makeMethodFn("PATCH"),
    post: makeMethodFn("POST"),
    put: makeMethodFn("PUT"),
    request,
    setConfig,
    sse: {
      connect: makeSseFn("CONNECT"),
      delete: makeSseFn("DELETE"),
      get: makeSseFn("GET"),
      head: makeSseFn("HEAD"),
      options: makeSseFn("OPTIONS"),
      patch: makeSseFn("PATCH"),
      post: makeSseFn("POST"),
      put: makeSseFn("PUT"),
      trace: makeSseFn("TRACE")
    },
    trace: makeMethodFn("TRACE")
  };
};

// src/generated/client.gen.ts
var client = createClient(
  createConfig({
    baseUrl: "https://ix8b43sg3j.execute-api.us-west-2.amazonaws.com"
  })
);

// src/generated/sdk.gen.ts
var getContentTypes = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/types",
  ...options
});
var listContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/list",
  ...options
});
var deleteContent = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/{id}",
  ...options
});
var readContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/{id}",
  ...options
});
var writeContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/{id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var queryContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/query",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var searchContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/search",
  ...options
});
var getContentTree = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/tree",
  ...options
});
var getContentStats = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/stats",
  ...options
});
var bulkReadContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/bulk/read",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkWriteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/bulk/write",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkDeleteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/bulk/delete",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var queryKnowledgeBase = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/kb/query",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var ragKnowledgeBase = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/kb/rag",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var downloadRepository = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/download",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getRepoDownloadStatus = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/status",
  ...options
});
var listDownloadedRepos = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/list",
  ...options
});
var githubCheckAccess = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/check_access",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var githubListBranches = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/list_branches",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var githubGetContents = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/get_contents",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var createMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/mission/create",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var updateMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/mission/{id}/update",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getMissionContext = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/mission/{id}/context",
  ...options
});
var discoverSimilar = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/discover",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var findByTicket = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/discover/ticket",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteRepository = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/delete",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var checkRepoExists = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/exists",
  ...options
});
var moveContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/move",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var lockContent = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/lock",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var unlockContent = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/unlock",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var checkConflicts = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/conflicts",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getPresignedUrl = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/{id}/url",
  ...options
});
var downloadContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/download",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var findContentBy = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{type}/find",
  ...options
});
var authLogin = (options) => (options.client ?? client).post({
  url: "/auth/login",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var authRefresh = (options) => (options.client ?? client).post({
  url: "/auth/refresh",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var authGetConfig = (options) => (options?.client ?? client).get({
  url: "/auth/config",
  ...options
});
var authListWorkspaces = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/auth/workspaces",
  ...options
});
var listSessions = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session",
  ...options
});
var createSession = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getSessionMessages = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{id}/messages",
  ...options
});
var updateSessionMetadata = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{id}/metadata",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var forkSession = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{id}/fork",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var listMissionSessions = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{id}/session",
  ...options
});
var createMissionSession = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{id}/session",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var listProjects = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project",
  ...options
});
var createProject = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteProject = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}",
  ...options
});
var getProject = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}",
  ...options
});
var updateProject = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var addProjectRepo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/repos",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeProjectRepo = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/repos/{repo_id}",
  ...options
});
var setProjectDefaultRepo = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/default-repo",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getProjectContextRepos = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/context-repos",
  ...options
});
var addProjectMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/missions",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeProjectMission = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{id}/missions/{mission_id}",
  ...options
});
var createDocsSnapshot = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/docs/snapshot",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var listDocsSnapshots = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/docs/list",
  ...options
});
var getDocsSnapshotStatus = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/docs/status",
  ...options
});
var refreshIndex = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/index/refresh",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var learnFromMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/mission/{id}/learn",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});

// src/client.ts
function extractData(response) {
  if (response.error) {
    throw new Error(
      typeof response.error === "object" && response.error !== null ? response.error.message || JSON.stringify(response.error) : String(response.error)
    );
  }
  const ocxpResponse = response.data;
  if (ocxpResponse?.error) {
    throw new Error(
      typeof ocxpResponse.error === "object" && ocxpResponse.error !== null ? ocxpResponse.error.message || JSON.stringify(ocxpResponse.error) : String(ocxpResponse.error)
    );
  }
  return ocxpResponse?.data || {};
}
var OCXPClient = class {
  client;
  workspace;
  tokenProvider;
  constructor(options) {
    this.workspace = options.workspace || "dev";
    this.tokenProvider = options.token;
    const config = createConfig({
      baseUrl: options.endpoint.replace(/\/$/, "")
    });
    this.client = createClient(config);
  }
  /**
   * Get authorization headers
   */
  async getHeaders() {
    const headers = {};
    if (this.tokenProvider) {
      const token = typeof this.tokenProvider === "function" ? await this.tokenProvider() : this.tokenProvider;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }
  /**
   * Set the workspace for subsequent operations
   */
  setWorkspace(workspace) {
    this.workspace = workspace;
  }
  /**
   * Get current workspace
   */
  getWorkspace() {
    return this.workspace;
  }
  /**
   * Set the auth token or token provider
   */
  setToken(token) {
    this.tokenProvider = token;
  }
  // ============== Content Types ==============
  /**
   * Get available content types with metadata
   */
  async getContentTypes(counts = false) {
    const headers = await this.getHeaders();
    const response = await getContentTypes({
      client: this.client,
      query: { workspace: this.workspace, counts },
      headers
    });
    const data = extractData(response);
    return {
      types: data.types || [],
      total: data.total || 0
    };
  }
  // ============== CRUD Operations ==============
  /**
   * List content of a specific type
   */
  async list(type, path, limit) {
    const headers = await this.getHeaders();
    const response = await listContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path, limit },
      headers
    });
    const data = extractData(response);
    return {
      entries: data.entries || [],
      cursor: data.cursor,
      hasMore: data.hasMore || false,
      total: data.total || 0
    };
  }
  /**
   * Read content by ID
   */
  async read(type, id) {
    const headers = await this.getHeaders();
    const response = await readContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace },
      headers
    });
    const data = extractData(response);
    return {
      content: data.content || "",
      size: data.size,
      mtime: data.mtime,
      encoding: data.encoding,
      metadata: data.metadata
    };
  }
  /**
   * Write content
   */
  async write(type, id, content, options) {
    const headers = await this.getHeaders();
    const body = {
      content,
      ...options
    };
    const response = await writeContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace },
      body,
      headers
    });
    const data = extractData(response);
    return {
      path: data.path || `${type}/${id}`,
      etag: data.etag
    };
  }
  /**
   * Delete content
   */
  async delete(type, id, recursive = false, confirm = false) {
    const headers = await this.getHeaders();
    const response = await deleteContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace, recursive, confirm },
      headers
    });
    const data = extractData(response);
    return {
      deleted: data.deleted ?? true,
      path: data.path || `${type}/${id}`
    };
  }
  // ============== Query & Search ==============
  /**
   * Query content with filters
   */
  async query(type, filters, limit) {
    const headers = await this.getHeaders();
    return queryContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { filters, limit },
      headers
    });
  }
  /**
   * Full-text search
   */
  async search(type, q, fuzzy = false, limit) {
    const headers = await this.getHeaders();
    return searchContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, q, fuzzy, limit },
      headers
    });
  }
  // ============== Tree & Stats ==============
  /**
   * Get hierarchical tree structure
   */
  async tree(type, path, depth) {
    const headers = await this.getHeaders();
    return getContentTree({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path, depth },
      headers
    });
  }
  /**
   * Get content statistics
   */
  async stats(type, path) {
    const headers = await this.getHeaders();
    return getContentStats({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path },
      headers
    });
  }
  // ============== Bulk Operations ==============
  /**
   * Read multiple items at once
   */
  async bulkRead(type, ids, options) {
    const headers = await this.getHeaders();
    return bulkReadContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { ids, options },
      headers
    });
  }
  /**
   * Write multiple items at once
   */
  async bulkWrite(type, items, options) {
    const headers = await this.getHeaders();
    return bulkWriteContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { items, options },
      headers
    });
  }
  /**
   * Delete multiple items at once
   */
  async bulkDelete(type, ids, options) {
    const headers = await this.getHeaders();
    return bulkDeleteContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { ids, options },
      headers
    });
  }
  // ============== Knowledge Base ==============
  /**
   * Semantic search in Knowledge Base
   */
  async kbQuery(query, searchType = "SEMANTIC", maxResults) {
    const headers = await this.getHeaders();
    const body = {
      query,
      searchType,
      maxResults
    };
    return queryKnowledgeBase({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers
    });
  }
  /**
   * RAG with citations
   */
  async kbRag(query, sessionId, systemPrompt) {
    const headers = await this.getHeaders();
    return ragKnowledgeBase({
      client: this.client,
      query: { workspace: this.workspace },
      body: { query, sessionId, systemPrompt },
      headers
    });
  }
  // ============== Tools ==============
  /**
   * Create a new mission from ticket
   */
  async createMission(ticketId, ticketSummary, ticketDescription) {
    const headers = await this.getHeaders();
    const body = {
      ticket_id: ticketId,
      ticket_summary: ticketSummary,
      ticket_description: ticketDescription,
      workspace: this.workspace
    };
    return createMission({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers
    });
  }
  /**
   * Update mission progress
   */
  async updateMission(missionId, updates) {
    const headers = await this.getHeaders();
    return updateMission({
      client: this.client,
      path: { id: missionId },
      query: { workspace: this.workspace },
      body: updates,
      headers
    });
  }
  /**
   * Get mission context for agents
   */
  async getMissionContext(missionId) {
    const headers = await this.getHeaders();
    return getMissionContext({
      client: this.client,
      path: { id: missionId },
      query: { workspace: this.workspace },
      headers
    });
  }
  /**
   * Discover similar content across types
   */
  async discover(query, contentType, maxResults, includeRelated = true) {
    const headers = await this.getHeaders();
    const body = {
      query,
      content_type: contentType,
      max_results: maxResults,
      include_related: includeRelated
    };
    return discoverSimilar({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers
    });
  }
  /**
   * Find content by Jira ticket ID
   */
  async findByTicket(ticketId) {
    const headers = await this.getHeaders();
    return findByTicket({
      client: this.client,
      query: { workspace: this.workspace },
      body: { ticket_id: ticketId },
      headers
    });
  }
  // ============== Locking ==============
  /**
   * Acquire exclusive lock on content
   */
  async lock(path, ttl) {
    const headers = await this.getHeaders();
    return lockContent({
      client: this.client,
      body: { path, ttl },
      headers
    });
  }
  /**
   * Release exclusive lock
   */
  async unlock(path, lockToken) {
    const headers = await this.getHeaders();
    return unlockContent({
      client: this.client,
      body: { path, lockToken },
      headers
    });
  }
  // ============== GitHub API Proxy ==============
  /**
   * Check if a repository is accessible
   */
  async githubCheckAccess(owner, repo, githubToken) {
    const headers = await this.getHeaders();
    const response = await githubCheckAccess({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, github_token: githubToken },
      headers
    });
    return extractData(response);
  }
  /**
   * List branches for a repository
   */
  async githubListBranches(owner, repo, githubToken) {
    const headers = await this.getHeaders();
    const response = await githubListBranches({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, github_token: githubToken },
      headers
    });
    return extractData(response);
  }
  /**
   * Get repository contents at a path
   */
  async githubGetContents(owner, repo, path = "", ref = "main", githubToken) {
    const headers = await this.getHeaders();
    const response = await githubGetContents({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, path, ref, github_token: githubToken },
      headers
    });
    return extractData(response);
  }
  // ============== Repository Management ==============
  /**
   * Download repository and trigger vectorization
   * Uses tarball download for efficiency (single GitHub request)
   */
  async downloadRepository(request) {
    const headers = await this.getHeaders();
    const response = await downloadRepository({
      client: this.client,
      query: { workspace: this.workspace },
      body: request,
      headers
    });
    return extractData(response);
  }
  /**
   * Get repository download/vectorization status
   */
  async getRepoStatus(jobId) {
    const headers = await this.getHeaders();
    const response = await getRepoDownloadStatus({
      client: this.client,
      query: { workspace: this.workspace, job_id: jobId },
      headers
    });
    return extractData(response);
  }
  /**
   * List all downloaded repositories in workspace
   */
  async listRepos(options) {
    const headers = await this.getHeaders();
    const response = await listDownloadedRepos({
      client: this.client,
      query: {
        workspace: this.workspace,
        visibility: options?.visibility,
        repo_id: options?.repoId
      },
      headers
    });
    return extractData(response);
  }
  /**
   * Delete a repository and all associated data
   * Removes S3 files, job records, and project references
   */
  async deleteRepository(repoId) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.client.getConfig().baseUrl}/ocxp/repo/delete?workspace=${this.workspace}`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ repo_id: repoId })
      }
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete repository: ${error}`);
    }
    const result = await response.json();
    return result.data;
  }
  /**
   * Check if a repository already exists in the system
   */
  async checkRepoExists(repoId) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.client.getConfig().baseUrl}/ocxp/repo/exists?workspace=${this.workspace}&repo_id=${encodeURIComponent(repoId)}`,
      {
        method: "GET",
        headers
      }
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to check repository exists: ${error}`);
    }
    const result = await response.json();
    return result.data;
  }
};
function createOCXPClient(options) {
  return new OCXPClient(options);
}

// src/path.ts
var VALID_CONTENT_TYPES = [
  "mission",
  "project",
  "context",
  "sop",
  "repo",
  "artifact",
  "kb",
  "docs"
];
var TYPE_ALIASES = {
  mission: "mission",
  missions: "mission",
  project: "project",
  projects: "project",
  context: "context",
  contexts: "context",
  sop: "sop",
  sops: "sop",
  repo: "repo",
  repos: "repo",
  artifact: "artifact",
  artifacts: "artifact",
  kb: "kb",
  kbs: "kb",
  docs: "docs"
};
function parsePath(path) {
  const normalized = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = normalized.split("/");
  if (parts.length === 0 || !parts[0]) {
    throw new Error(`Invalid path: ${path}`);
  }
  const typeKey = parts[0].toLowerCase();
  const type = TYPE_ALIASES[typeKey];
  if (!type) {
    throw new Error(
      `Invalid content type: ${parts[0]}. Valid types: ${VALID_CONTENT_TYPES.join(", ")}`
    );
  }
  const id = parts.length > 1 ? parts.slice(1).join("/") : void 0;
  return { type, id };
}
function normalizePath(path) {
  return path.replace(/^missions\//, "mission/").replace(/^projects\//, "project/").replace(/^contexts\//, "context/").replace(/^sops\//, "sop/").replace(/^repos\//, "repo/").replace(/^artifacts\//, "artifact/").replace(/^kbs\//, "kb/");
}
function isValidContentType(type) {
  return VALID_CONTENT_TYPES.includes(type);
}
function getCanonicalType(type) {
  return TYPE_ALIASES[type.toLowerCase()];
}
function buildPath(type, id) {
  if (id) {
    return `${type}/${id}`;
  }
  return `${type}/`;
}

// src/path-service.ts
var OCXPPathService = class {
  client;
  endpoint;
  workspace;
  constructor(options) {
    this.endpoint = options.endpoint;
    this.workspace = options.workspace || "dev";
    this.client = new OCXPClient({
      endpoint: options.endpoint,
      workspace: this.workspace,
      token: options.token
    });
  }
  // ===========================================================================
  // Read Operations
  // ===========================================================================
  /**
   * List directory contents
   *
   * @param path - Path like 'mission/' or 'project/'
   * @param limit - Maximum entries to return
   * @returns List result with entries
   */
  async list(path, limit) {
    const { type, id } = parsePath(path);
    const result = await this.client.list(type, id, limit);
    return {
      path,
      entries: result.entries.map(
        (entry) => ({
          name: entry.name ?? "",
          path: normalizePath(entry.path ?? ""),
          type: entry.type ?? "file",
          size: entry.size,
          mtime: entry.mtime
        })
      ),
      cursor: result.cursor,
      hasMore: result.hasMore,
      total: result.total
    };
  }
  /**
   * Read file content
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @returns Read result with content
   */
  async read(path) {
    const { type, id } = parsePath(path);
    if (!id) {
      throw new Error(`Cannot read directory path: ${path}`);
    }
    const result = await this.client.read(type, id);
    return {
      path,
      type: "text",
      content: result.content,
      encoding: result.encoding ?? "utf-8",
      info: {
        path,
        size: result.size,
        mtime: result.mtime
      }
    };
  }
  /**
   * Check if path exists
   *
   * @param path - Path to check
   * @returns true if exists
   */
  async exists(path) {
    try {
      const { type, id } = parsePath(path);
      if (!id) {
        await this.client.list(type);
        return true;
      }
      await this.client.read(type, id);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Get file metadata
   *
   * @param path - Path to get info for
   * @returns File info
   */
  async info(path) {
    const { type, id } = parsePath(path);
    const result = await this.client.stats(type, id);
    const data = result?.data || {};
    return {
      path,
      size: data.size,
      mtime: data.mtime,
      hash: data.hash,
      contentType: data.contentType
    };
  }
  // ===========================================================================
  // Write Operations
  // ===========================================================================
  /**
   * Write/update file content
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @param content - File content
   * @param options - Write options
   * @returns Write result
   */
  async write(path, content, options) {
    const { type, id } = parsePath(path);
    if (!id) {
      throw new Error(`Cannot write to directory path: ${path}`);
    }
    await this.client.write(type, id, content, {
      encoding: options?.encoding,
      metadata: options?.metadata,
      ifNotExists: options?.ifNotExists,
      etag: options?.etag
    });
    return {
      success: true,
      path
    };
  }
  /**
   * Delete a file
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @returns Write result
   */
  async delete(path) {
    const { type, id } = parsePath(path);
    if (!id) {
      throw new Error(`Cannot delete directory path without id: ${path}`);
    }
    await this.client.delete(type, id);
    return {
      success: true,
      path
    };
  }
  /**
   * Move/rename a file
   *
   * Implemented as read + write + delete
   *
   * @param sourcePath - Source path
   * @param destPath - Destination path
   * @returns Move result
   */
  async move(sourcePath, destPath) {
    const content = await this.read(sourcePath);
    await this.write(destPath, content.content);
    await this.delete(sourcePath);
    return {
      success: true,
      sourcePath,
      destPath
    };
  }
  // ===========================================================================
  // Utility Methods
  // ===========================================================================
  /**
   * Get the underlying OCXPClient
   */
  getClient() {
    return this.client;
  }
  /**
   * Get the API endpoint
   */
  getEndpoint() {
    return this.endpoint;
  }
  /**
   * Get the workspace ID
   */
  getWorkspace() {
    return this.workspace;
  }
  /**
   * Update the workspace
   */
  setWorkspace(workspace) {
    this.client.setWorkspace(workspace);
  }
  /**
   * Update the auth token
   */
  setToken(token) {
    this.client.setToken(token);
  }
};
function createPathService(options) {
  return new OCXPPathService(options);
}

// src/websocket.ts
var WebSocketService = class {
  constructor(options) {
    this.options = options;
  }
  ws = null;
  reconnectAttempts = 0;
  reconnectTimeout = null;
  eventHandlers = /* @__PURE__ */ new Map();
  connectionStateHandlers = /* @__PURE__ */ new Set();
  connectionPromise = null;
  _connectionState = "disconnected";
  shouldReconnect = true;
  /**
   * Get current connection state
   */
  get connectionState() {
    return this._connectionState;
  }
  /**
   * Check if connected
   */
  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  /**
   * Connect to WebSocket server
   */
  async connect() {
    if (this.connectionPromise) return this.connectionPromise;
    if (this.connected) return Promise.resolve();
    this.shouldReconnect = true;
    this.connectionPromise = this.doConnect();
    return this.connectionPromise;
  }
  setConnectionState(state) {
    this._connectionState = state;
    this.connectionStateHandlers.forEach((handler) => handler(state));
  }
  async doConnect() {
    this.setConnectionState("connecting");
    const token = typeof this.options.token === "function" ? await this.options.token() : this.options.token;
    const params = new URLSearchParams({
      workspace: this.options.workspace
    });
    if (this.options.userId) {
      params.set("user_id", this.options.userId);
    }
    if (token) {
      params.set("token", token);
    }
    const url = `${this.options.endpoint}?${params}`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        reject(new Error("WebSocket connection timeout"));
      }, this.options.connectionTimeoutMs ?? 1e4);
      try {
        this.ws = new WebSocket(url);
      } catch (error) {
        clearTimeout(timeout);
        this.connectionPromise = null;
        this.setConnectionState("disconnected");
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }
      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.reconnectAttempts = 0;
        this.setConnectionState("connected");
        resolve();
      };
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.dispatchMessage(message);
        } catch {
        }
      };
      this.ws.onclose = (event) => {
        clearTimeout(timeout);
        this.connectionPromise = null;
        if (this.shouldReconnect && event.code !== 1e3) {
          this.setConnectionState("reconnecting");
          this.handleReconnect();
        } else {
          this.setConnectionState("disconnected");
        }
      };
      this.ws.onerror = () => {
        clearTimeout(timeout);
        this.connectionPromise = null;
        reject(new Error("WebSocket connection failed"));
      };
    });
  }
  handleReconnect() {
    if (!this.shouldReconnect) return;
    const maxAttempts = this.options.maxReconnectAttempts ?? 5;
    if (this.reconnectAttempts >= maxAttempts) {
      this.setConnectionState("disconnected");
      return;
    }
    const delay = (this.options.reconnectDelayMs ?? 1e3) * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
      });
    }, delay);
  }
  dispatchMessage(message) {
    const handlers = this.eventHandlers.get(message.type);
    handlers?.forEach((handler) => handler(message));
    const wildcardHandlers = this.eventHandlers.get("*");
    wildcardHandlers?.forEach((handler) => handler(message));
  }
  /**
   * Subscribe to message types
   * @returns Unsubscribe function
   */
  on(type, handler) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, /* @__PURE__ */ new Set());
    }
    this.eventHandlers.get(type).add(handler);
    return () => this.eventHandlers.get(type)?.delete(handler);
  }
  /**
   * Subscribe to job progress updates
   */
  onJobProgress(handler) {
    return this.on("job_progress", handler);
  }
  /**
   * Subscribe to repository status updates
   */
  onRepoStatus(handler) {
    return this.on("repo_status", handler);
  }
  /**
   * Subscribe to notifications
   */
  onNotification(handler) {
    return this.on("notification", handler);
  }
  /**
   * Subscribe to sync events
   */
  onSyncEvent(handler) {
    return this.on("sync_event", handler);
  }
  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(handler) {
    this.connectionStateHandlers.add(handler);
    return () => this.connectionStateHandlers.delete(handler);
  }
  /**
   * Subscribe to specific job updates
   */
  subscribeToJob(jobId) {
    this.send({ action: "subscribe", type: "job", id: jobId });
  }
  /**
   * Subscribe to repository updates
   */
  subscribeToRepo(repoId) {
    this.send({ action: "subscribe", type: "repo", id: repoId });
  }
  /**
   * Send message to server
   */
  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  /**
   * Send ping to keep connection alive
   */
  ping() {
    this.send({ action: "ping" });
  }
  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close(1e3, "Client disconnect");
      this.ws = null;
    }
    this.connectionPromise = null;
    this.reconnectAttempts = 0;
    this.setConnectionState("disconnected");
  }
  /**
   * Clear all event handlers
   */
  clearHandlers() {
    this.eventHandlers.clear();
    this.connectionStateHandlers.clear();
  }
};
function createWebSocketService(options) {
  return new WebSocketService(options);
}

export { OCXPClient, OCXPPathService, VALID_CONTENT_TYPES, WebSocketService, addProjectMission, addProjectRepo, authGetConfig, authListWorkspaces, authLogin, authRefresh, buildPath, bulkDeleteContent, bulkReadContent, bulkWriteContent, checkConflicts, checkRepoExists, createClient, createConfig, createDocsSnapshot, createMission, createMissionSession, createOCXPClient, createPathService, createProject, createSession, createWebSocketService, deleteContent, deleteProject, deleteRepository, discoverSimilar, downloadContent, downloadRepository, findByTicket, findContentBy, forkSession, getCanonicalType, getContentStats, getContentTree, getContentTypes, getDocsSnapshotStatus, getMissionContext, getPresignedUrl, getProject, getProjectContextRepos, getRepoDownloadStatus, getSessionMessages, githubCheckAccess, githubGetContents, githubListBranches, isValidContentType, learnFromMission, listContent, listDocsSnapshots, listDownloadedRepos, listMissionSessions, listProjects, listSessions, lockContent, moveContent, normalizePath, parsePath, queryContent, queryKnowledgeBase, ragKnowledgeBase, readContent, refreshIndex, removeProjectMission, removeProjectRepo, searchContent, setProjectDefaultRepo, unlockContent, updateMission, updateProject, updateSessionMetadata, writeContent };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map