import { z } from 'zod';

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
var client = createClient(createConfig());

// src/generated/sdk.gen.ts
var bulkReadContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/bulk/read",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkWriteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/bulk/write",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkDeleteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/bulk/delete",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getContentTypes = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/types",
  ...options
});
var listContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/list",
  ...options
});
var queryContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/query",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var searchContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/search",
  ...options
});
var getContentTree = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/tree",
  ...options
});
var getContentStats = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/stats",
  ...options
});
var deleteContent = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/{content_id}",
  ...options
});
var readContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/{content_id}",
  ...options
});
var writeContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/{content_type}/{content_id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var lockContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/lock",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var unlockContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/unlock",
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
  url: "/ocxp/repo/status/{job_id}",
  ...options
});
var listDownloadedRepos = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/list",
  ...options
});
var githubCheckAccess = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/check-access",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var githubListBranches = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/branches",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var githubGetContents = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/github/contents",
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
  url: "/tools/mission/{mission_id}/update",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getMissionContext = (options) => (options.client ?? client).get(
  {
    security: [{ scheme: "bearer", type: "http" }],
    url: "/tools/mission/{mission_id}/context",
    ...options
  }
);
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

// src/client.ts
function extractData(response) {
  if (response.error) {
    throw new Error(
      typeof response.error === "object" && response.error !== null ? response.error.message || JSON.stringify(response.error) : String(response.error)
    );
  }
  return response.data;
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
   * Get headers including workspace and auth
   */
  async getHeaders() {
    const headers = {
      "X-Workspace": this.workspace
    };
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
      query: { counts },
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
      path: { content_type: type },
      query: { path, limit },
      headers
    });
    const data = extractData(response);
    return {
      entries: data.entries || [],
      cursor: data.cursor,
      hasMore: data.has_more || false,
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
      path: { content_type: type, content_id: id },
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
      encoding: options?.encoding || "utf-8",
      etag: options?.etag,
      ifNotExists: options?.ifNotExists
    };
    const response = await writeContent({
      client: this.client,
      path: { content_type: type, content_id: id },
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
      path: { content_type: type, content_id: id },
      query: { recursive, confirm },
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
      path: { content_type: type },
      body: { filters: filters || [], limit: limit || 100 },
      headers
    });
  }
  /**
   * Full-text search
   */
  async search(type, q, limit) {
    const headers = await this.getHeaders();
    return searchContent({
      client: this.client,
      path: { content_type: type },
      query: { q, limit },
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
      path: { content_type: type },
      query: { path, depth },
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
      path: { content_type: type },
      query: { path },
      headers
    });
  }
  // ============== Bulk Operations ==============
  /**
   * Read multiple items at once
   */
  async bulkRead(type, ids) {
    const headers = await this.getHeaders();
    return bulkReadContent({
      client: this.client,
      path: { content_type: type },
      body: { ids },
      headers
    });
  }
  /**
   * Write multiple items at once
   */
  async bulkWrite(type, items) {
    const headers = await this.getHeaders();
    return bulkWriteContent({
      client: this.client,
      path: { content_type: type },
      body: { items },
      headers
    });
  }
  /**
   * Delete multiple items at once
   */
  async bulkDelete(type, ids) {
    const headers = await this.getHeaders();
    return bulkDeleteContent({
      client: this.client,
      path: { content_type: type },
      body: { ids },
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
      search_type: searchType,
      max_results: maxResults || 5
    };
    return queryKnowledgeBase({
      client: this.client,
      body,
      headers
    });
  }
  /**
   * RAG with citations
   */
  async kbRag(query, sessionId) {
    const headers = await this.getHeaders();
    return ragKnowledgeBase({
      client: this.client,
      body: { query, session_id: sessionId },
      headers
    });
  }
  // ============== Tools ==============
  /**
   * Create a new mission
   */
  async createMission(name, description, projectId, goals) {
    const headers = await this.getHeaders();
    const body = {
      name,
      description,
      project_id: projectId,
      goals
    };
    return createMission({
      client: this.client,
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
      path: { mission_id: missionId },
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
      path: { mission_id: missionId },
      headers
    });
  }
  /**
   * Discover similar content across types
   */
  async discover(query, contentTypes, limit) {
    const headers = await this.getHeaders();
    const body = {
      query,
      content_types: contentTypes,
      limit
    };
    return discoverSimilar({
      client: this.client,
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
      body: { ticket_id: ticketId },
      headers
    });
  }
  // ============== Locking ==============
  /**
   * Acquire exclusive lock on content
   * @param contentType - Content type (e.g., "mission")
   * @param contentId - Content ID (e.g., "my-mission")
   * @param ttl - Lock time-to-live in seconds
   */
  async lock(contentType, contentId, ttl) {
    const headers = await this.getHeaders();
    return lockContent({
      client: this.client,
      body: {
        content_type: contentType,
        content_id: contentId,
        ttl
      },
      headers
    });
  }
  /**
   * Release exclusive lock
   * @param contentType - Content type
   * @param contentId - Content ID
   */
  async unlock(contentType, contentId) {
    const headers = await this.getHeaders();
    return unlockContent({
      client: this.client,
      body: {
        content_type: contentType,
        content_id: contentId
      },
      headers
    });
  }
  // ============== GitHub API Proxy ==============
  /**
   * Check if a repository is accessible
   * @param repoUrl - Full GitHub repository URL
   */
  async githubCheckAccess(repoUrl) {
    const headers = await this.getHeaders();
    return githubCheckAccess({
      client: this.client,
      body: { repo_url: repoUrl },
      headers
    });
  }
  /**
   * List branches for a repository
   * @param repoUrl - Full GitHub repository URL
   */
  async githubListBranches(repoUrl) {
    const headers = await this.getHeaders();
    return githubListBranches({
      client: this.client,
      body: { repo_url: repoUrl },
      headers
    });
  }
  /**
   * Get repository contents at a path
   * @param repoUrl - Full GitHub repository URL
   * @param path - Path within the repository
   * @param ref - Git ref (branch, tag, or commit)
   */
  async githubGetContents(repoUrl, path = "", ref) {
    const headers = await this.getHeaders();
    return githubGetContents({
      client: this.client,
      body: { repo_url: repoUrl, path, ref },
      headers
    });
  }
  // ============== Repository Management ==============
  /**
   * Download repository and trigger vectorization
   * @param repoUrl - Full GitHub repository URL
   * @param branch - Optional branch (default: main)
   * @param mode - Download mode: full or docs_only
   */
  async downloadRepository(repoUrl, branch, mode) {
    const headers = await this.getHeaders();
    return downloadRepository({
      client: this.client,
      body: { repo_url: repoUrl, branch, mode },
      headers
    });
  }
  /**
   * Get repository download status
   */
  async getRepoStatus(jobId) {
    const headers = await this.getHeaders();
    return getRepoDownloadStatus({
      client: this.client,
      path: { job_id: jobId },
      headers
    });
  }
  /**
   * List all downloaded repositories in workspace
   */
  async listRepos() {
    const headers = await this.getHeaders();
    return listDownloadedRepos({
      client: this.client,
      headers
    });
  }
  /**
   * Delete a repository
   * Note: This endpoint is not yet implemented in the API
   */
  async deleteRepository(_repoId) {
    throw new Error("deleteRepository is not yet implemented in the OCXP API");
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

// src/types/errors.ts
var OCXPErrorCode = /* @__PURE__ */ ((OCXPErrorCode2) => {
  OCXPErrorCode2["NETWORK_ERROR"] = "NETWORK_ERROR";
  OCXPErrorCode2["VALIDATION_ERROR"] = "VALIDATION_ERROR";
  OCXPErrorCode2["AUTH_ERROR"] = "AUTH_ERROR";
  OCXPErrorCode2["NOT_FOUND"] = "NOT_FOUND";
  OCXPErrorCode2["RATE_LIMITED"] = "RATE_LIMITED";
  OCXPErrorCode2["CONFLICT"] = "CONFLICT";
  OCXPErrorCode2["TIMEOUT"] = "TIMEOUT";
  OCXPErrorCode2["SERVER_ERROR"] = "SERVER_ERROR";
  OCXPErrorCode2["UNKNOWN"] = "UNKNOWN";
  return OCXPErrorCode2;
})(OCXPErrorCode || {});
var OCXPError = class extends Error {
  /** Error code for programmatic handling */
  code;
  /** HTTP status code if applicable */
  statusCode;
  /** Additional error details */
  details;
  /** Request ID for debugging */
  requestId;
  /** Original cause of the error */
  cause;
  constructor(message, code = "UNKNOWN" /* UNKNOWN */, statusCode = 500, options) {
    super(message);
    this.name = "OCXPError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = options?.details;
    this.requestId = options?.requestId;
    this.cause = options?.cause;
    if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack
    };
  }
};
var OCXPNetworkError = class extends OCXPError {
  constructor(message, options) {
    super(message, "NETWORK_ERROR" /* NETWORK_ERROR */, 0, options);
    this.name = "OCXPNetworkError";
  }
};
var OCXPValidationError = class extends OCXPError {
  /** Field-level validation errors */
  validationErrors;
  constructor(message, validationErrors, options) {
    super(message, "VALIDATION_ERROR" /* VALIDATION_ERROR */, 400, {
      ...options,
      details: { ...options?.details, validationErrors }
    });
    this.name = "OCXPValidationError";
    this.validationErrors = validationErrors;
  }
};
var OCXPAuthError = class extends OCXPError {
  constructor(message, options) {
    super(message, "AUTH_ERROR" /* AUTH_ERROR */, 401, options);
    this.name = "OCXPAuthError";
  }
};
var OCXPNotFoundError = class extends OCXPError {
  /** The resource path that was not found */
  path;
  constructor(message, path, options) {
    super(message, "NOT_FOUND" /* NOT_FOUND */, 404, {
      ...options,
      details: { ...options?.details, path }
    });
    this.name = "OCXPNotFoundError";
    this.path = path;
  }
};
var OCXPRateLimitError = class extends OCXPError {
  /** Seconds until rate limit resets */
  retryAfter;
  constructor(message = "Rate limit exceeded", retryAfter, options) {
    super(message, "RATE_LIMITED" /* RATE_LIMITED */, 429, {
      ...options,
      details: { ...options?.details, retryAfter }
    });
    this.name = "OCXPRateLimitError";
    this.retryAfter = retryAfter;
  }
};
var OCXPConflictError = class extends OCXPError {
  /** Expected etag value */
  expectedEtag;
  /** Actual etag value */
  actualEtag;
  constructor(message, options) {
    super(message, "CONFLICT" /* CONFLICT */, 409, {
      details: {
        ...options?.details,
        expectedEtag: options?.expectedEtag,
        actualEtag: options?.actualEtag
      },
      requestId: options?.requestId,
      cause: options?.cause
    });
    this.name = "OCXPConflictError";
    this.expectedEtag = options?.expectedEtag;
    this.actualEtag = options?.actualEtag;
  }
};
var OCXPTimeoutError = class extends OCXPError {
  /** Timeout duration in milliseconds */
  timeoutMs;
  constructor(message = "Operation timed out", timeoutMs, options) {
    super(message, "TIMEOUT" /* TIMEOUT */, 408, {
      ...options,
      details: { ...options?.details, timeoutMs }
    });
    this.name = "OCXPTimeoutError";
    this.timeoutMs = timeoutMs;
  }
};
function isOCXPError(error) {
  return error instanceof OCXPError;
}
function isOCXPNetworkError(error) {
  return error instanceof OCXPNetworkError;
}
function isOCXPValidationError(error) {
  return error instanceof OCXPValidationError;
}
function isOCXPAuthError(error) {
  return error instanceof OCXPAuthError;
}
function isOCXPNotFoundError(error) {
  return error instanceof OCXPNotFoundError;
}
function isOCXPRateLimitError(error) {
  return error instanceof OCXPRateLimitError;
}
function isOCXPConflictError(error) {
  return error instanceof OCXPConflictError;
}
function isOCXPTimeoutError(error) {
  return error instanceof OCXPTimeoutError;
}
function mapHttpError(statusCode, message, options) {
  const baseOptions = {
    details: options?.details,
    requestId: options?.requestId
  };
  switch (statusCode) {
    case 400:
      return new OCXPValidationError(message, void 0, baseOptions);
    case 401:
    case 403:
      return new OCXPAuthError(message, baseOptions);
    case 404:
      return new OCXPNotFoundError(message, options?.path, baseOptions);
    case 408:
      return new OCXPTimeoutError(message, void 0, baseOptions);
    case 409:
      return new OCXPConflictError(message, baseOptions);
    case 429:
      return new OCXPRateLimitError(message, options?.retryAfter, baseOptions);
    default:
      if (statusCode >= 500) {
        return new OCXPError(message, "SERVER_ERROR" /* SERVER_ERROR */, statusCode, baseOptions);
      }
      return new OCXPError(message, "UNKNOWN" /* UNKNOWN */, statusCode, baseOptions);
  }
}
var MetaSchema = z.object({
  requestId: z.string(),
  timestamp: z.string(),
  durationMs: z.number(),
  operation: z.string()
});
var ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional()
});
var OCXPResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: ErrorResponseSchema.nullable().optional(),
  notifications: z.array(z.unknown()).optional(),
  meta: MetaSchema.optional()
});
var PaginationSchema = z.object({
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean(),
  total: z.number()
});
var ContentTypeSchema = z.enum([
  "mission",
  "project",
  "context",
  "sop",
  "repo",
  "artifact",
  "kb",
  "docs"
]);
function createResponseSchema(dataSchema) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ErrorResponseSchema.nullable().optional(),
    notifications: z.array(z.unknown()).optional(),
    meta: MetaSchema.optional()
  });
}
var ListEntrySchema = z.object({
  name: z.string(),
  type: z.enum(["file", "directory"]),
  path: z.string(),
  size: z.number().optional(),
  mtime: z.string().optional()
});
var ListDataSchema = z.object({
  entries: z.array(ListEntrySchema),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional().default(false),
  total: z.number().optional().default(0)
});
var ListResponseSchema = createResponseSchema(ListDataSchema);
var ReadDataSchema = z.object({
  content: z.string(),
  size: z.number().optional(),
  mtime: z.string().optional(),
  encoding: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  etag: z.string().optional()
});
var ReadResponseSchema = createResponseSchema(ReadDataSchema);
var WriteDataSchema = z.object({
  path: z.string(),
  etag: z.string().optional(),
  size: z.number().optional()
});
var WriteResponseSchema = createResponseSchema(WriteDataSchema);
var DeleteDataSchema = z.object({
  path: z.string(),
  deleted: z.boolean().optional().default(true)
});
var DeleteResponseSchema = createResponseSchema(DeleteDataSchema);
var QueryFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "ne", "gt", "lt", "gte", "lte", "contains", "startsWith"]),
  value: z.unknown()
});
var QueryDataSchema = z.object({
  items: z.array(z.record(z.string(), z.unknown())),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional().default(false),
  total: z.number().optional().default(0)
});
var QueryResponseSchema = createResponseSchema(QueryDataSchema);
var SearchDataSchema = z.object({
  results: z.array(
    z.object({
      path: z.string(),
      score: z.number().optional(),
      highlights: z.array(z.string()).optional(),
      content: z.string().optional()
    })
  ),
  total: z.number().optional().default(0)
});
var SearchResponseSchema = createResponseSchema(SearchDataSchema);
var TreeNodeSchema = z.lazy(
  () => z.object({
    name: z.string(),
    path: z.string(),
    type: z.enum(["file", "directory"]),
    size: z.number().optional(),
    children: z.array(TreeNodeSchema).optional()
  })
);
var TreeDataSchema = z.object({
  root: TreeNodeSchema,
  depth: z.number().optional()
});
var TreeResponseSchema = createResponseSchema(TreeDataSchema);
var StatsDataSchema = z.object({
  totalFiles: z.number(),
  totalSize: z.number(),
  lastModified: z.string().optional(),
  fileTypes: z.record(z.string(), z.number()).optional()
});
var StatsResponseSchema = createResponseSchema(StatsDataSchema);
var ContentTypeInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  prefix: z.string().nullable().optional(),
  isVirtual: z.boolean().optional(),
  isGlobal: z.boolean().optional(),
  count: z.number().nullable().optional(),
  endpoints: z.record(z.string(), z.string()).optional()
});
var ContentTypesDataSchema = z.object({
  types: z.array(ContentTypeInfoSchema)
});
var ContentTypesResponseSchema = createResponseSchema(ContentTypesDataSchema);
var PresignedUrlDataSchema = z.object({
  url: z.string(),
  expiresAt: z.string().optional(),
  method: z.enum(["GET", "PUT"]).optional()
});
var PresignedUrlResponseSchema = createResponseSchema(PresignedUrlDataSchema);
var SessionMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
var SessionSchema = z.object({
  id: z.string(),
  missionId: z.string().optional(),
  title: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  messageCount: z.number().optional()
});
var ListSessionsDataSchema = z.object({
  sessions: z.array(SessionSchema),
  total: z.number().optional()
});
var ListSessionsResponseSchema = createResponseSchema(ListSessionsDataSchema);
var CreateSessionDataSchema = z.object({
  sessionId: z.string(),
  missionId: z.string().optional()
});
var CreateSessionResponseSchema = createResponseSchema(CreateSessionDataSchema);
var GetSessionMessagesDataSchema = z.object({
  messages: z.array(SessionMessageSchema),
  sessionId: z.string()
});
var GetSessionMessagesResponseSchema = createResponseSchema(GetSessionMessagesDataSchema);
var UpdateSessionMetadataDataSchema = z.object({
  sessionId: z.string(),
  metadata: z.record(z.string(), z.unknown())
});
var UpdateSessionMetadataResponseSchema = createResponseSchema(
  UpdateSessionMetadataDataSchema
);
var ForkSessionDataSchema = z.object({
  sessionId: z.string(),
  forkedFromId: z.string()
});
var ForkSessionResponseSchema = createResponseSchema(ForkSessionDataSchema);
var ProjectRepoSchema = z.object({
  repoId: z.string(),
  isDefault: z.boolean().optional(),
  addedAt: z.string().optional()
});
var ProjectMissionSchema = z.object({
  missionId: z.string(),
  addedAt: z.string().optional()
});
var ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  repos: z.array(ProjectRepoSchema).optional(),
  missions: z.array(ProjectMissionSchema).optional(),
  defaultRepoId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
var ListProjectsDataSchema = z.object({
  projects: z.array(ProjectSchema),
  total: z.number().optional()
});
var ListProjectsResponseSchema = createResponseSchema(ListProjectsDataSchema);
var CreateProjectDataSchema = z.object({
  projectId: z.string(),
  project: ProjectSchema.optional()
});
var CreateProjectResponseSchema = createResponseSchema(CreateProjectDataSchema);
var GetProjectDataSchema = ProjectSchema;
var GetProjectResponseSchema = createResponseSchema(GetProjectDataSchema);
var UpdateProjectDataSchema = z.object({
  projectId: z.string(),
  project: ProjectSchema.optional()
});
var UpdateProjectResponseSchema = createResponseSchema(UpdateProjectDataSchema);
var DeleteProjectDataSchema = z.object({
  projectId: z.string(),
  deleted: z.boolean()
});
var DeleteProjectResponseSchema = createResponseSchema(DeleteProjectDataSchema);
var AddProjectRepoDataSchema = z.object({
  projectId: z.string(),
  repoId: z.string()
});
var AddProjectRepoResponseSchema = createResponseSchema(AddProjectRepoDataSchema);
var ContextReposDataSchema = z.object({
  repos: z.array(
    z.object({
      repoId: z.string(),
      name: z.string().optional(),
      isDefault: z.boolean().optional()
    })
  )
});
var ContextReposResponseSchema = createResponseSchema(ContextReposDataSchema);
var RepoStatusEnum = z.enum([
  "queued",
  "processing",
  "uploading",
  "vectorizing",
  "complete",
  "failed"
]);
var RepoDownloadRequestSchema = z.object({
  github_url: z.string(),
  repo_id: z.string(),
  branch: z.string().optional().default("main"),
  path: z.string().nullable().optional(),
  mode: z.enum(["full", "docs_only"]).optional().default("full"),
  include_extensions: z.array(z.string()).optional(),
  exclude_patterns: z.array(z.string()).optional(),
  max_file_size_kb: z.number().min(1).max(5e3).optional().default(500),
  visibility: z.enum(["private", "public"]).optional().default("private"),
  trigger_vectorization: z.boolean().optional().default(true),
  generate_metadata: z.boolean().optional().default(true),
  is_private: z.boolean().optional().default(false)
});
var RepoDownloadDataSchema = z.object({
  repo_id: z.string(),
  job_id: z.string(),
  s3_path: z.string().optional(),
  status: RepoStatusEnum,
  files_processed: z.number().optional(),
  metadata_files_created: z.number().optional(),
  ingestion_job_id: z.string().nullable().optional()
});
var RepoDownloadResponseSchema = createResponseSchema(RepoDownloadDataSchema);
var RepoStatusDataSchema = z.object({
  job_id: z.string(),
  status: RepoStatusEnum,
  progress: z.number().min(0).max(100).optional(),
  files_processed: z.number().optional(),
  total_files: z.number().optional(),
  error: z.string().nullable().optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional()
});
var RepoStatusResponseSchema = createResponseSchema(RepoStatusDataSchema);
var RepoListItemSchema = z.object({
  repo_id: z.string(),
  github_url: z.string().optional(),
  branch: z.string().optional(),
  visibility: z.enum(["private", "public"]).optional(),
  mode: z.enum(["full", "docs_only"]).optional(),
  files_count: z.number().optional(),
  last_synced: z.string().optional(),
  s3_path: z.string().optional()
});
var RepoListDataSchema = z.object({
  repos: z.array(RepoListItemSchema),
  total: z.number().optional()
});
var RepoListResponseSchema = createResponseSchema(RepoListDataSchema);
var RepoExistsDataSchema = z.object({
  repo_id: z.string(),
  exists: z.boolean(),
  indexed_at: z.string().nullable().optional(),
  files_count: z.number().optional()
});
var RepoExistsResponseSchema = createResponseSchema(RepoExistsDataSchema);
var RepoDeleteDataSchema = z.object({
  repo_id: z.string(),
  success: z.boolean(),
  s3_files_deleted: z.number().optional(),
  projects_updated: z.number().optional(),
  error: z.string().optional()
});
var RepoDeleteResponseSchema = createResponseSchema(RepoDeleteDataSchema);
var AuthTokenDataSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional().default("Bearer"),
  expiresIn: z.number().optional(),
  expiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  scope: z.string().optional()
});
var AuthTokenResponseSchema = createResponseSchema(AuthTokenDataSchema);
var AuthUserInfoSchema = z.object({
  userId: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
var AuthUserInfoResponseSchema = createResponseSchema(AuthUserInfoSchema);
var AuthValidateDataSchema = z.object({
  valid: z.boolean(),
  userId: z.string().optional(),
  expiresAt: z.string().optional()
});
var AuthValidateResponseSchema = createResponseSchema(AuthValidateDataSchema);
var SearchResultItemSchema = z.object({
  id: z.string(),
  path: z.string().optional(),
  content: z.string().optional(),
  score: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  source: z.string().optional(),
  type: z.string().optional()
});
var VectorSearchDataSchema = z.object({
  results: z.array(SearchResultItemSchema),
  total: z.number().optional(),
  query: z.string().optional(),
  processingTimeMs: z.number().optional()
});
var VectorSearchResponseSchema = createResponseSchema(VectorSearchDataSchema);
var KBDocumentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string(),
  path: z.string().optional(),
  source: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  vectorId: z.string().optional()
});
var KBListDataSchema = z.object({
  documents: z.array(KBDocumentSchema),
  total: z.number().optional(),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional()
});
var KBListResponseSchema = createResponseSchema(KBListDataSchema);
var KBIngestDataSchema = z.object({
  documentId: z.string(),
  vectorId: z.string().optional(),
  chunksCreated: z.number().optional(),
  status: z.enum(["pending", "processing", "complete", "failed"]).optional()
});
var KBIngestResponseSchema = createResponseSchema(KBIngestDataSchema);
var DiscoveryEndpointSchema = z.object({
  name: z.string(),
  path: z.string(),
  methods: z.array(z.string()),
  description: z.string().optional(),
  parameters: z.array(z.record(z.string(), z.unknown())).optional()
});
var DiscoveryDataSchema = z.object({
  version: z.string().optional(),
  endpoints: z.array(DiscoveryEndpointSchema),
  contentTypes: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional()
});
var DiscoveryResponseSchema = createResponseSchema(DiscoveryDataSchema);
var IngestionJobSchema = z.object({
  jobId: z.string(),
  status: z.enum(["queued", "processing", "complete", "failed"]),
  progress: z.number().min(0).max(100).optional(),
  documentsProcessed: z.number().optional(),
  totalDocuments: z.number().optional(),
  error: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional()
});
var IngestionJobResponseSchema = createResponseSchema(IngestionJobSchema);
var WSMessageTypeSchema = z.enum([
  "chat",
  "chat_response",
  "stream_start",
  "stream_chunk",
  "stream_end",
  "error",
  "ping",
  "pong",
  "connected",
  "disconnected",
  "session_start",
  "session_end",
  "typing",
  "status"
]);
var WSBaseMessageSchema = z.object({
  type: WSMessageTypeSchema,
  id: z.string().optional(),
  timestamp: z.string().optional(),
  sessionId: z.string().optional()
});
var WSChatMessageSchema = WSBaseMessageSchema.extend({
  type: z.literal("chat"),
  content: z.string(),
  missionId: z.string().optional(),
  projectId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
var WSChatResponseSchema = WSBaseMessageSchema.extend({
  type: z.literal("chat_response"),
  content: z.string(),
  role: z.enum(["assistant", "system"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  usage: z.object({
    promptTokens: z.number().optional(),
    completionTokens: z.number().optional(),
    totalTokens: z.number().optional()
  }).optional()
});
var WSStreamStartSchema = WSBaseMessageSchema.extend({
  type: z.literal("stream_start"),
  streamId: z.string()
});
var WSStreamChunkSchema = WSBaseMessageSchema.extend({
  type: z.literal("stream_chunk"),
  streamId: z.string(),
  content: z.string(),
  index: z.number().optional()
});
var WSStreamEndSchema = WSBaseMessageSchema.extend({
  type: z.literal("stream_end"),
  streamId: z.string(),
  usage: z.object({
    promptTokens: z.number().optional(),
    completionTokens: z.number().optional(),
    totalTokens: z.number().optional()
  }).optional()
});
var WSErrorMessageSchema = WSBaseMessageSchema.extend({
  type: z.literal("error"),
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional()
});
var WSPingPongSchema = WSBaseMessageSchema.extend({
  type: z.enum(["ping", "pong"])
});
var WSConnectedSchema = WSBaseMessageSchema.extend({
  type: z.literal("connected"),
  connectionId: z.string().optional(),
  serverVersion: z.string().optional()
});
var WSStatusSchema = WSBaseMessageSchema.extend({
  type: z.literal("status"),
  status: z.enum(["ready", "busy", "processing", "idle"]),
  message: z.string().optional()
});
var WSMessageSchema = z.discriminatedUnion("type", [
  WSChatMessageSchema,
  WSChatResponseSchema,
  WSStreamStartSchema,
  WSStreamChunkSchema,
  WSStreamEndSchema,
  WSErrorMessageSchema,
  WSPingPongSchema.extend({ type: z.literal("ping") }),
  WSPingPongSchema.extend({ type: z.literal("pong") }),
  WSConnectedSchema,
  WSStatusSchema
]);
function parseWSMessage(data) {
  const parsed = JSON.parse(data);
  return WSMessageSchema.parse(parsed);
}
function safeParseWSMessage(data) {
  try {
    const parsed = JSON.parse(data);
    const result = WSMessageSchema.safeParse(parsed);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: "custom",
          message: "Invalid JSON",
          path: []
        }
      ])
    };
  }
}
var GithubFileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  type: z.enum(["file", "dir", "symlink", "submodule"]),
  url: z.string().optional(),
  html_url: z.string().optional(),
  git_url: z.string().optional(),
  download_url: z.string().nullable().optional(),
  content: z.string().optional(),
  encoding: z.string().optional()
});
var GithubRepoInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string().optional(),
    type: z.string().optional()
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
  visibility: z.string().optional()
});
var GithubBranchInfoSchema = z.object({
  name: z.string(),
  commit: z.object({
    sha: z.string(),
    url: z.string().optional()
  }),
  protected: z.boolean().optional()
});
var GithubCommitInfoSchema = z.object({
  sha: z.string(),
  message: z.string().optional(),
  author: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    date: z.string().optional()
  }).optional(),
  committer: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    date: z.string().optional()
  }).optional(),
  url: z.string().optional(),
  html_url: z.string().optional()
});
var GithubFileDataSchema = z.object({
  file: GithubFileInfoSchema,
  content: z.string().optional(),
  encoding: z.string().optional()
});
var GithubFileResponseSchema = createResponseSchema(GithubFileDataSchema);
var GithubDirectoryDataSchema = z.object({
  entries: z.array(GithubFileInfoSchema),
  path: z.string()
});
var GithubDirectoryResponseSchema = createResponseSchema(GithubDirectoryDataSchema);
var GithubRepoDataSchema = z.object({
  repository: GithubRepoInfoSchema
});
var GithubRepoResponseSchema = createResponseSchema(GithubRepoDataSchema);
var GithubBranchesDataSchema = z.object({
  branches: z.array(GithubBranchInfoSchema)
});
var GithubBranchesResponseSchema = createResponseSchema(GithubBranchesDataSchema);
var GithubCommitsDataSchema = z.object({
  commits: z.array(GithubCommitInfoSchema)
});
var GithubCommitsResponseSchema = createResponseSchema(GithubCommitsDataSchema);

export { AddProjectRepoDataSchema, AddProjectRepoResponseSchema, AuthTokenDataSchema, AuthTokenResponseSchema, AuthUserInfoResponseSchema, AuthUserInfoSchema, AuthValidateDataSchema, AuthValidateResponseSchema, ContentTypeInfoSchema, ContentTypeSchema, ContentTypesDataSchema, ContentTypesResponseSchema, ContextReposDataSchema, ContextReposResponseSchema, CreateProjectDataSchema, CreateProjectResponseSchema, CreateSessionDataSchema, CreateSessionResponseSchema, DeleteDataSchema, DeleteProjectDataSchema, DeleteProjectResponseSchema, DeleteResponseSchema, DiscoveryDataSchema, DiscoveryEndpointSchema, DiscoveryResponseSchema, ErrorResponseSchema, ForkSessionDataSchema, ForkSessionResponseSchema, GetProjectDataSchema, GetProjectResponseSchema, GetSessionMessagesDataSchema, GetSessionMessagesResponseSchema, GithubBranchInfoSchema, GithubBranchesDataSchema, GithubBranchesResponseSchema, GithubCommitInfoSchema, GithubCommitsDataSchema, GithubCommitsResponseSchema, GithubDirectoryDataSchema, GithubDirectoryResponseSchema, GithubFileDataSchema, GithubFileInfoSchema, GithubFileResponseSchema, GithubRepoDataSchema, GithubRepoInfoSchema, GithubRepoResponseSchema, IngestionJobResponseSchema, IngestionJobSchema, KBDocumentSchema, KBIngestDataSchema, KBIngestResponseSchema, KBListDataSchema, KBListResponseSchema, ListDataSchema, ListEntrySchema, ListProjectsDataSchema, ListProjectsResponseSchema, ListResponseSchema, ListSessionsDataSchema, ListSessionsResponseSchema, MetaSchema, OCXPAuthError, OCXPClient, OCXPConflictError, OCXPError, OCXPErrorCode, OCXPNetworkError, OCXPNotFoundError, OCXPPathService, OCXPRateLimitError, OCXPResponseSchema, OCXPTimeoutError, OCXPValidationError, PaginationSchema, PresignedUrlDataSchema, PresignedUrlResponseSchema, ProjectMissionSchema, ProjectRepoSchema, ProjectSchema, QueryDataSchema, QueryFilterSchema, QueryResponseSchema, ReadDataSchema, ReadResponseSchema, RepoDeleteDataSchema, RepoDeleteResponseSchema, RepoDownloadDataSchema, RepoDownloadRequestSchema, RepoDownloadResponseSchema, RepoExistsDataSchema, RepoExistsResponseSchema, RepoListDataSchema, RepoListItemSchema, RepoListResponseSchema, RepoStatusDataSchema, RepoStatusEnum, RepoStatusResponseSchema, SearchDataSchema, SearchResponseSchema, SearchResultItemSchema, SessionMessageSchema, SessionSchema, StatsDataSchema, StatsResponseSchema, TreeDataSchema, TreeNodeSchema, TreeResponseSchema, UpdateProjectDataSchema, UpdateProjectResponseSchema, UpdateSessionMetadataDataSchema, UpdateSessionMetadataResponseSchema, VALID_CONTENT_TYPES, VectorSearchDataSchema, VectorSearchResponseSchema, WSBaseMessageSchema, WSChatMessageSchema, WSChatResponseSchema, WSConnectedSchema, WSErrorMessageSchema, WSMessageSchema, WSMessageTypeSchema, WSPingPongSchema, WSStatusSchema, WSStreamChunkSchema, WSStreamEndSchema, WSStreamStartSchema, WebSocketService, WriteDataSchema, WriteResponseSchema, buildPath, bulkDeleteContent, bulkReadContent, bulkWriteContent, createClient, createConfig, createMission, createOCXPClient, createPathService, createResponseSchema, createWebSocketService, deleteContent, discoverSimilar, downloadRepository, findByTicket, getCanonicalType, getContentStats, getContentTree, getContentTypes, getMissionContext, getRepoDownloadStatus, githubCheckAccess, githubGetContents, githubListBranches, isOCXPAuthError, isOCXPConflictError, isOCXPError, isOCXPNetworkError, isOCXPNotFoundError, isOCXPRateLimitError, isOCXPTimeoutError, isOCXPValidationError, isValidContentType, listContent, listDownloadedRepos, lockContent, mapHttpError, normalizePath, parsePath, parseWSMessage, queryContent, queryKnowledgeBase, ragKnowledgeBase, readContent, safeParseWSMessage, searchContent, unlockContent, updateMission, writeContent };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map