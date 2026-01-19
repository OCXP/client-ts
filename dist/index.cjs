'use strict';

var zod = require('zod');

// src/generated/core/bodySerializer.gen.ts
var serializeUrlSearchParamsPair = (data, key, value) => {
  if (typeof value === "string") {
    data.append(key, value);
  } else {
    data.append(key, JSON.stringify(value));
  }
};
var jsonBodySerializer = {
  bodySerializer: (body) => JSON.stringify(body, (_key, value) => typeof value === "bigint" ? value.toString() : value)
};
var urlSearchParamsBodySerializer = {
  bodySerializer: (body) => {
    const data = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value === void 0 || value === null) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => serializeUrlSearchParamsPair(data, key, v));
      } else {
        serializeUrlSearchParamsPair(data, key, value);
      }
    });
    return data.toString();
  }
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
var bulkReadContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/bulk/read",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkWriteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/bulk/write",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var bulkDeleteContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/bulk/delete",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var listPrototypeChats = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/list",
  ...options
});
var previewPrototypeChat = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/preview",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var linkPrototypeChat = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/link",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var syncPrototypeChat = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/sync",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getPrototypeChat = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/{provider}/{chat_id}",
  ...options
});
var syncPrototypeChatAsync = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/sync-async",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getSyncStatus = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/prototype/chat/sync-status/{job_id}",
  ...options
});
var listSessions = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session",
  ...options
});
var getSessionMessages = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{session_id}/messages",
  ...options
});
var updateSessionMetadata = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{session_id}/metadata",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var forkSession = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{session_id}/fork",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var archiveSession = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/session/{session_id}/archive",
  ...options
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
  url: "/ocxp/project/{project_id}",
  ...options
});
var getProject = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}",
  ...options
});
var updateProject = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var addLinkedRepo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/repos",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeLinkedRepo = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/repos/{repo_id}",
  ...options
});
var setDefaultRepo = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/default-repo",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getContextRepos = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/context-repos",
  ...options
});
var addMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/missions",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeMission = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/missions/{mission_id}",
  ...options
});
var getProjectDatabases = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/databases",
  ...options
});
var addDatabase = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/databases",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeDatabase = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/databases/{database_id}",
  ...options
});
var setDefaultDatabase = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/project/{project_id}/default-database",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var listMissions = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission",
  ...options
});
var createMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteMission = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}",
  ...options
});
var getMission = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}",
  ...options
});
var updateMission = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var addSession = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}/sessions",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var removeSession = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}/sessions/{session_id}",
  ...options
});
var regenerateMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/mission/{mission_id}/regenerate",
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
var listMemos = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo",
  ...options
});
var createMemo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteMemo = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/{memo_id}",
  ...options
});
var getMemo = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/{memo_id}",
  ...options
});
var getMemoForSource = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/source/{source_type}/{source_id}",
  ...options
});
var resolveMemo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/{memo_id}/resolve",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var acknowledgeMemo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/{memo_id}/acknowledge",
  ...options
});
var ignoreMemo = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/memo/{memo_id}/ignore",
  ...options
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
var deleteRepo = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/repo/{repo_id}",
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
var listDatabases = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database",
  ...options
});
var createDatabase = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteDatabase = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database/{database_id}",
  ...options
});
var getDatabase = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database/{database_id}",
  ...options
});
var updateDatabase = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database/{database_id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var testDatabaseConnection = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/database/{database_id}/test",
  ...options
});
var getSchema = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/database/schema",
  ...options
});
var getSample = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/database/sample/{table_name}",
  ...options
});
var listTables = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/database/tables",
  ...options
});
var listContextDatabases = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/database/databases",
  ...options
});
var getContentTypes = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/types",
  ...options
});
var listContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/list",
  ...options
});
var queryContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/query",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var searchContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/search",
  ...options
});
var getContentTree = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/tree",
  ...options
});
var getContentStats = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/stats",
  ...options
});
var deleteContent = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/{content_id}",
  ...options
});
var readContent = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/{content_id}",
  ...options
});
var writeContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/{content_type}/{content_id}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var moveContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/move",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var lockContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/lock",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var unlockContent = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/ocxp/context/unlock",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var toolCreateMission = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/tools/mission/create",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var toolUpdateMission = (options) => (options.client ?? client).post({
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
var loginForAccessToken = (options) => (options.client ?? client).post({
  ...urlSearchParamsBodySerializer,
  url: "/auth/token",
  ...options,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    ...options.headers
  }
});
var login = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/auth/login",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var refreshTokens = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/auth/refresh",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getAuthConfig = (options) => (options?.client ?? client).get({
  url: "/auth/config",
  ...options
});
var getCurrentUser = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/auth/me",
  ...options
});
var listWorkspaces = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/auth/workspaces",
  ...options
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
      baseUrl: options.endpoint.replace(/\/$/, ""),
      throwOnError: true
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
   * Get the underlying client for SDK function calls
   */
  getClient() {
    return this.client;
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
   * Get hierarchical tree structure from S3 context
   * @param includeVersions - If true, includes S3 version IDs for files
   */
  async tree(type, path, depth, includeVersions) {
    const headers = await this.getHeaders();
    const response = await getContentTree({
      client: this.client,
      path: { content_type: type },
      query: { path, depth, includeVersions },
      headers
    });
    return extractData(response);
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
   * Semantic search in Knowledge Base with optional external docs fallback
   */
  async kbQuery(query, options) {
    const headers = await this.getHeaders();
    const body = {
      query,
      search_type: options?.searchType || "SEMANTIC",
      max_results: options?.maxResults || 5,
      doc_id: options?.docId,
      repo_ids: options?.repoIds,
      project_id: options?.projectId,
      mission_id: options?.missionId,
      enable_fallback: options?.enableFallback ?? true,
      fallback_threshold: options?.fallbackThreshold ?? 0.5,
      persist_external_docs: options?.persistExternalDocs ?? true
    };
    const response = await queryKnowledgeBase({
      client: this.client,
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * RAG with citations
   */
  async kbRag(query, sessionId) {
    const headers = await this.getHeaders();
    const response = await ragKnowledgeBase({
      client: this.client,
      body: { query, session_id: sessionId },
      headers
    });
    return extractData(response);
  }
  // ============== Mission Operations ==============
  /**
   * List all missions in workspace
   */
  async listMissions(options) {
    const headers = await this.getHeaders();
    const response = await listMissions({
      client: this.client,
      query: {
        project_id: options?.projectId,
        status: options?.status,
        limit: options?.limit
      },
      headers
    });
    return extractData(response);
  }
  /**
   * Create a new mission with auto-generated UUID
   */
  async createMission(title, description, projectId, goals) {
    const headers = await this.getHeaders();
    const body = {
      title,
      description,
      project_id: projectId,
      goals
    };
    const response = await createMission({
      client: this.client,
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Get mission by ID
   */
  async getMission(missionId) {
    const headers = await this.getHeaders();
    const response = await getMission({
      client: this.client,
      path: { mission_id: missionId },
      headers
    });
    return extractData(response);
  }
  /**
   * Update mission
   */
  async updateMission(missionId, updates) {
    const headers = await this.getHeaders();
    const response = await updateMission({
      client: this.client,
      path: { mission_id: missionId },
      body: updates,
      headers
    });
    return extractData(response);
  }
  /**
   * Delete mission
   */
  async deleteMission(missionId) {
    const headers = await this.getHeaders();
    await deleteMission({
      client: this.client,
      path: { mission_id: missionId },
      headers
    });
  }
  /**
   * Add session to mission
   */
  async addMissionSession(missionId, sessionId) {
    const headers = await this.getHeaders();
    const response = await addSession({
      client: this.client,
      path: { mission_id: missionId },
      body: { session_id: sessionId },
      headers
    });
    return extractData(response);
  }
  /**
   * Remove session from mission
   */
  async removeMissionSession(missionId, sessionId) {
    const headers = await this.getHeaders();
    const response = await removeSession({
      client: this.client,
      path: { mission_id: missionId, session_id: sessionId },
      headers
    });
    return extractData(response);
  }
  /**
   * Regenerate mission - archives old docs and triggers AgentCore
   */
  async regenerateMission(missionId, options) {
    const headers = await this.getHeaders();
    const response = await regenerateMission({
      client: this.client,
      path: { mission_id: missionId },
      body: {
        ticket_id: options?.ticket_id,
        ticket_summary: options?.ticket_summary,
        ticket_description: options?.ticket_description,
        archive_old_docs: options?.archive_old_docs ?? true,
        auto_increment_version: options?.auto_increment_version ?? true
      },
      headers
    });
    return extractData(response);
  }
  /**
   * Download mission pack as ZIP file
   * @param missionId - Mission ID
   * @returns Blob containing ZIP file
   */
  async downloadMissionPack(missionId) {
    const headers = await this.getHeaders();
    const config = this.client.getConfig();
    const baseUrl = config.baseUrl || "";
    const response = await fetch(`${baseUrl}/ocxp/mission/${missionId}/download`, {
      method: "GET",
      headers: {
        ...headers,
        "X-Workspace": this.workspace
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to download mission: ${response.status} ${response.statusText}`);
    }
    return await response.blob();
  }
  // ============== Tools ==============
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
  /**
   * Move/rename content
   * @param source - Source path (e.g., "mission/old-id")
   * @param destination - Destination path (e.g., "mission/new-id")
   * @param overwrite - Whether to overwrite existing content at destination
   */
  async move(source, destination, overwrite = false) {
    const headers = await this.getHeaders();
    const response = await moveContent({
      client: this.client,
      body: { source, destination, overwrite },
      headers
    });
    return extractData(response);
  }
  // ============== GitHub API Proxy ==============
  /**
   * Check if a repository is accessible
   * @param repoUrl - Full GitHub repository URL
   */
  async githubCheckAccess(repoUrl) {
    const headers = await this.getHeaders();
    const response = await githubCheckAccess({
      client: this.client,
      body: { repo_url: repoUrl },
      headers
    });
    return extractData(response);
  }
  /**
   * List branches for a repository
   * @param repoUrl - Full GitHub repository URL
   */
  async githubListBranches(repoUrl) {
    const headers = await this.getHeaders();
    const response = await githubListBranches({
      client: this.client,
      body: { repo_url: repoUrl },
      headers
    });
    return extractData(response);
  }
  /**
   * Get repository contents at a path
   * @param repoUrl - Full GitHub repository URL
   * @param path - Path within the repository
   * @param ref - Git ref (branch, tag, or commit)
   */
  async githubGetContents(repoUrl, path = "", ref) {
    const headers = await this.getHeaders();
    const response = await githubGetContents({
      client: this.client,
      body: { repo_url: repoUrl, path, ref },
      headers
    });
    return extractData(response);
  }
  // ============== Repository Management ==============
  /**
   * Download repository and trigger vectorization
   * @param repoUrl - Full GitHub repository URL
   * @param branch - Optional branch (default: main)
   * @param options - Download options (mode, repo_type, path)
   */
  async downloadRepository(repoUrl, branch, options) {
    const headers = await this.getHeaders();
    const response = await downloadRepository({
      client: this.client,
      body: {
        repo_url: repoUrl,
        branch,
        mode: options?.mode,
        repo_type: options?.repo_type,
        path: options?.path
      },
      headers
    });
    return extractData(response);
  }
  /**
   * Get repository download status
   */
  async getRepoStatus(jobId) {
    const headers = await this.getHeaders();
    const response = await getRepoDownloadStatus({
      client: this.client,
      path: { job_id: jobId },
      headers
    });
    return extractData(response);
  }
  /**
   * List all downloaded repositories in workspace
   */
  async listRepos() {
    const headers = await this.getHeaders();
    const response = await listDownloadedRepos({
      client: this.client,
      headers
    });
    return extractData(response);
  }
  /**
   * Delete a downloaded repository by its UUID
   */
  async deleteRepo(repoId) {
    const headers = await this.getHeaders();
    const response = await deleteRepo({
      client: this.client,
      path: { repo_id: repoId },
      headers
    });
    return extractData(response);
  }
  // ============== Database Operations ==============
  /**
   * List all database configurations in workspace
   */
  async listDatabases() {
    const headers = await this.getHeaders();
    const response = await listDatabases({
      client: this.client,
      headers
    });
    return extractData(response);
  }
  /**
   * Create a new database configuration
   */
  async createDatabase(config) {
    const headers = await this.getHeaders();
    const response = await createDatabase({
      client: this.client,
      body: config,
      headers
    });
    return extractData(response);
  }
  /**
   * Get database configuration by ID
   */
  async getDatabase(databaseId) {
    const headers = await this.getHeaders();
    const response = await getDatabase({
      client: this.client,
      path: { database_id: databaseId },
      headers
    });
    return extractData(response);
  }
  /**
   * Update database configuration
   */
  async updateDatabase(databaseId, updates) {
    const headers = await this.getHeaders();
    const response = await updateDatabase({
      client: this.client,
      path: { database_id: databaseId },
      body: updates,
      headers
    });
    return extractData(response);
  }
  /**
   * Delete database configuration
   */
  async deleteDatabase(databaseId) {
    const headers = await this.getHeaders();
    await deleteDatabase({
      client: this.client,
      path: { database_id: databaseId },
      headers
    });
  }
  /**
   * Test database connection
   */
  async testDatabaseConnection(databaseId) {
    const headers = await this.getHeaders();
    const response = await testDatabaseConnection({
      client: this.client,
      path: { database_id: databaseId },
      headers
    });
    return extractData(response);
  }
  /**
   * Get database schema (tables and columns)
   */
  async getDatabaseSchema(databaseId) {
    const headers = await this.getHeaders();
    const response = await getSchema({
      client: this.client,
      query: { database_id: databaseId },
      headers
    });
    return extractData(response);
  }
  /**
   * Get sample data from a table
   */
  async getDatabaseSample(tableName, databaseId, limit) {
    const headers = await this.getHeaders();
    const response = await getSample({
      client: this.client,
      path: { table_name: tableName },
      query: { database_id: databaseId, limit },
      headers
    });
    return extractData(response);
  }
  /**
   * List all tables in database
   */
  async listDatabaseTables(databaseId) {
    const headers = await this.getHeaders();
    const response = await listTables({
      client: this.client,
      query: { database_id: databaseId },
      headers
    });
    return extractData(response);
  }
  // ============== Project Operations ==============
  /**
   * List all projects in workspace
   */
  async listProjects(limit) {
    const headers = await this.getHeaders();
    const response = await listProjects({
      client: this.client,
      query: { limit },
      headers
    });
    return extractData(response);
  }
  /**
   * Create a new project with auto-generated UUID
   */
  async createProject(name, description) {
    const headers = await this.getHeaders();
    const body = {
      name,
      description
    };
    const response = await createProject({
      client: this.client,
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Get project by ID
   */
  async getProject(projectId) {
    const headers = await this.getHeaders();
    const response = await getProject({
      client: this.client,
      path: { project_id: projectId },
      headers
    });
    return extractData(response);
  }
  /**
   * Update project
   */
  async updateProject(projectId, updates) {
    const headers = await this.getHeaders();
    const response = await updateProject({
      client: this.client,
      path: { project_id: projectId },
      body: updates,
      headers
    });
    return extractData(response);
  }
  /**
   * Delete project
   */
  async deleteProject(projectId) {
    const headers = await this.getHeaders();
    await deleteProject({
      client: this.client,
      path: { project_id: projectId },
      headers
    });
  }
  /**
   * Add repository to project
   */
  async addProjectRepo(projectId, repoId, options) {
    const headers = await this.getHeaders();
    const body = {
      repo_id: repoId,
      category: options?.category,
      priority: options?.priority,
      auto_include: options?.autoInclude,
      branch: options?.branch
    };
    const response = await addLinkedRepo({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Remove repository from project
   */
  async removeProjectRepo(projectId, repoId) {
    const headers = await this.getHeaders();
    const response = await removeLinkedRepo({
      client: this.client,
      path: { project_id: projectId, repo_id: repoId },
      headers
    });
    return extractData(response);
  }
  /**
   * Set default repository for project
   */
  async setDefaultRepo(projectId, repoId) {
    const headers = await this.getHeaders();
    const body = { repo_id: repoId };
    const response = await setDefaultRepo({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Get context repositories for project (auto-include enabled)
   */
  async getContextRepos(projectId) {
    const headers = await this.getHeaders();
    const response = await getContextRepos({
      client: this.client,
      path: { project_id: projectId },
      headers
    });
    const data = extractData(response);
    return data.repos || [];
  }
  /**
   * Add mission to project
   */
  async addProjectMission(projectId, missionId) {
    const headers = await this.getHeaders();
    const body = { mission_id: missionId };
    const response = await addMission({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Remove mission from project
   */
  async removeProjectMission(projectId, missionId) {
    const headers = await this.getHeaders();
    const response = await removeMission({
      client: this.client,
      path: { project_id: projectId, mission_id: missionId },
      headers
    });
    return extractData(response);
  }
  // ============== Session Operations ==============
  /**
   * List all sessions in workspace
   */
  async listSessions(limit, status) {
    const headers = await this.getHeaders();
    const response = await listSessions({
      client: this.client,
      query: { limit, status },
      headers
    });
    return extractData(response);
  }
  /**
   * Get session messages
   */
  async getSessionMessages(sessionId, limit) {
    const headers = await this.getHeaders();
    const response = await getSessionMessages({
      client: this.client,
      path: { session_id: sessionId },
      query: { limit },
      headers
    });
    return extractData(response);
  }
  /**
   * Update session metadata
   */
  async updateSessionMetadata(sessionId, updates) {
    const headers = await this.getHeaders();
    const response = await updateSessionMetadata({
      client: this.client,
      path: { session_id: sessionId },
      body: updates,
      headers
    });
    return extractData(response);
  }
  /**
   * Fork session
   */
  async forkSession(sessionId, missionId, forkPoint) {
    const headers = await this.getHeaders();
    const body = { mission_id: missionId, fork_point: forkPoint };
    const response = await forkSession({
      client: this.client,
      path: { session_id: sessionId },
      body,
      headers
    });
    return extractData(response);
  }
  /**
   * Archive session
   */
  async archiveSession(sessionId) {
    const headers = await this.getHeaders();
    await archiveSession({
      client: this.client,
      path: { session_id: sessionId },
      headers
    });
  }
  // ============== Prototype Operations ==============
  /**
   * List all accessible prototype chats from a provider
   * @param provider - Filter by provider (v0, lovable, bolt)
   */
  async listPrototypeChats(provider) {
    const headers = await this.getHeaders();
    const response = await listPrototypeChats({
      client: this.client,
      query: { provider },
      headers
    });
    return extractData(response);
  }
  /**
   * Preview a prototype chat (fetch metadata without linking)
   * @param chatUrl - Chat URL to preview
   * @param provider - Prototype provider (optional, auto-detected from URL)
   */
  async previewPrototypeChat(chatUrl, provider) {
    const headers = await this.getHeaders();
    const response = await previewPrototypeChat({
      client: this.client,
      body: { chat_url: chatUrl, provider },
      headers
    });
    return extractData(response);
  }
  /**
   * Link a prototype chat to a mission
   * @param data - Link request data
   */
  async linkPrototypeChat(data) {
    const headers = await this.getHeaders();
    const response = await linkPrototypeChat({
      client: this.client,
      body: data,
      headers
    });
    return extractData(response);
  }
  /**
   * Sync/refresh a linked prototype chat
   * @param data - Sync request data
   */
  async syncPrototypeChat(data) {
    const headers = await this.getHeaders();
    const response = await syncPrototypeChat({
      client: this.client,
      body: data,
      headers
    });
    return extractData(response);
  }
  /**
   * Get stored prototype chat data
   * @param provider - Provider name (v0, lovable, bolt)
   * @param chatId - Chat ID
   * @param options - Optional query parameters
   */
  async getPrototypeChat(provider, chatId, options) {
    const headers = await this.getHeaders();
    const response = await getPrototypeChat({
      client: this.client,
      path: { provider, chat_id: chatId },
      query: { project_id: options?.projectId, version_id: options?.versionId },
      headers
    });
    return extractData(response);
  }
  /**
   * Start async prototype chat sync job
   * @param data - Async sync request data
   */
  async syncPrototypeChatAsync(data) {
    const headers = await this.getHeaders();
    const response = await syncPrototypeChatAsync({
      client: this.client,
      body: data,
      headers
    });
    return extractData(response);
  }
  /**
   * Get sync job status
   * @param jobId - Job ID from async sync response
   */
  async getPrototypeSyncStatus(jobId) {
    const headers = await this.getHeaders();
    const response = await getSyncStatus({
      client: this.client,
      path: { job_id: jobId },
      headers
    });
    return extractData(response);
  }
  // ============== Auth Operations ==============
  /**
   * Get auth configuration (public endpoint)
   */
  async getAuthConfig() {
    const response = await getAuthConfig({
      client: this.client
    });
    return extractData(response);
  }
  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const headers = await this.getHeaders();
    const response = await getCurrentUser({
      client: this.client,
      headers
    });
    return extractData(response);
  }
  /**
   * List workspaces for authenticated user
   */
  async listWorkspaces() {
    const headers = await this.getHeaders();
    const response = await listWorkspaces({
      client: this.client,
      headers
    });
    return extractData(response);
  }
  /**
   * Login with username and password (JSON endpoint for programmatic clients)
   * @param username - Cognito username
   * @param password - User password
   * @returns Token response with access_token, refresh_token, and expires_in
   */
  async login(username, password) {
    const response = await login({
      client: this.client,
      body: { username, password }
    });
    return extractData(response);
  }
  /**
   * Refresh access token using refresh token
   * @param refreshToken - The refresh token from login
   * @returns New access token (refresh token remains the same)
   */
  async refreshToken(refreshToken) {
    const response = await refreshTokens({
      client: this.client,
      body: { refreshToken }
    });
    return extractData(response);
  }
  /**
   * Set GitHub token for the authenticated user
   * Stores the token server-side linked to the Cognito identity
   * @param token - GitHub Personal Access Token
   * @returns Success response
   */
  async setGitHubToken(token) {
    const headers = await this.getHeaders();
    const response = await this.client.request({
      method: "PUT",
      url: "/auth/github-token",
      headers,
      body: { github_token: token }
    });
    if (response.error) {
      throw new Error(`Failed to set GitHub token: ${typeof response.error === "object" ? JSON.stringify(response.error) : response.error}`);
    }
    if (response.data === true) {
      return { success: true };
    }
    return response.data || { success: true };
  }
  /**
   * Get GitHub token status for the authenticated user
   * @returns Token status (configured or not)
   */
  async getGitHubTokenStatus() {
    const headers = await this.getHeaders();
    const response = await this.client.request({
      method: "GET",
      url: "/auth/github-token",
      headers
    });
    if (response.error) {
      throw new Error(`Failed to get GitHub token status: ${typeof response.error === "object" ? JSON.stringify(response.error) : response.error}`);
    }
    const data = response.data;
    if (data && typeof data === "object" && "configured" in data) {
      return data;
    }
    return { configured: false };
  }
  /**
   * Delete GitHub token for the authenticated user
   * @returns Success response
   */
  async deleteGitHubToken() {
    const headers = await this.getHeaders();
    const response = await this.client.request({
      method: "DELETE",
      url: "/auth/github-token",
      headers
    });
    if (response.error) {
      throw new Error(`Failed to delete GitHub token: ${typeof response.error === "object" ? JSON.stringify(response.error) : response.error}`);
    }
    if (response.data === true) {
      return { success: true };
    }
    return response.data || { success: true };
  }
  // ============== Namespaced Accessors ==============
  _mission;
  _project;
  _session;
  _kb;
  _prototype;
  /**
   * Mission namespace for convenient mission operations
   * @example ocxp.mission.list({ status: 'pending' })
   */
  get mission() {
    if (!this._mission) {
      this._mission = new MissionNamespace(this);
    }
    return this._mission;
  }
  /**
   * Project namespace for convenient project operations
   * @example ocxp.project.list()
   */
  get project() {
    if (!this._project) {
      this._project = new ProjectNamespace(this);
    }
    return this._project;
  }
  /**
   * Session namespace for convenient session operations
   * @example ocxp.session.list({ status: 'active' })
   */
  get session() {
    if (!this._session) {
      this._session = new SessionNamespace(this);
    }
    return this._session;
  }
  /**
   * KB namespace for convenient knowledge base operations
   * @example ocxp.kb.query('search term')
   */
  get kb() {
    if (!this._kb) {
      this._kb = new KBNamespace(this);
    }
    return this._kb;
  }
  /**
   * Prototype namespace for convenient prototype chat operations
   * @example ocxp.prototype.list('v0')
   */
  get prototype() {
    if (!this._prototype) {
      this._prototype = new PrototypeNamespace(this);
    }
    return this._prototype;
  }
};
var MissionNamespace = class {
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List missions with optional filtering
   * @example ocxp.mission.list({ status: 'active', limit: 10 })
   */
  async list(options) {
    return this.client.listMissions(options);
  }
  /**
   * Get a mission by ID
   * @example ocxp.mission.get('uuid')
   */
  async get(missionId) {
    return this.client.getMission(missionId);
  }
  /**
   * Create a new mission with auto-generated UUID
   * @example ocxp.mission.create({ title: 'My Mission', description: 'Description' })
   */
  async create(data) {
    return this.client.createMission(data.title, data.description, data.projectId, data.goals);
  }
  /**
   * Update mission
   */
  async update(missionId, updates) {
    return this.client.updateMission(missionId, updates);
  }
  /**
   * Delete mission
   */
  async delete(missionId) {
    return this.client.deleteMission(missionId);
  }
  /**
   * Add session to mission
   */
  async addSession(missionId, sessionId) {
    return this.client.addMissionSession(missionId, sessionId);
  }
  /**
   * Remove session from mission
   */
  async removeSession(missionId, sessionId) {
    return this.client.removeMissionSession(missionId, sessionId);
  }
  /**
   * Regenerate mission - archives old docs and triggers AgentCore
   * @example ocxp.mission.regenerate('uuid', { ticket_id: 'AMC-123' })
   */
  async regenerate(missionId, options) {
    return this.client.regenerateMission(missionId, options);
  }
  /**
   * Download mission pack as ZIP
   * @example await ocxp.mission.download('mission-id')
   */
  async download(missionId) {
    return this.client.downloadMissionPack(missionId);
  }
  /**
   * Get mission context for agents
   * @example ocxp.mission.getContext('uuid')
   */
  async getContext(missionId) {
    return this.client.getMissionContext(missionId);
  }
  /**
   * Get mission content tree structure from S3
   * @param includeVersions - If true, includes S3 version IDs for files
   * @example ocxp.mission.tree('mission-id', 5, true)
   */
  async tree(path, depth, includeVersions) {
    return this.client.tree("mission", path, depth, includeVersions);
  }
};
var ProjectNamespace = class {
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List all projects
   * @example ocxp.project.list()
   */
  async list(limit) {
    return this.client.listProjects(limit);
  }
  /**
   * Get a project by ID
   * @example ocxp.project.get('my-project')
   */
  async get(projectId) {
    return this.client.getProject(projectId);
  }
  /**
   * Create a new project with auto-generated UUID
   * @example ocxp.project.create({ name: 'My Project', description: 'Optional description' })
   */
  async create(data) {
    return this.client.createProject(data.name, data.description);
  }
  /**
   * Update a project
   */
  async update(projectId, data) {
    return this.client.updateProject(projectId, data);
  }
  /**
   * Delete a project
   */
  async delete(projectId) {
    return this.client.deleteProject(projectId);
  }
  /**
   * Add a repository to a project
   */
  async addRepo(projectId, repoId, options) {
    return this.client.addProjectRepo(projectId, repoId, options);
  }
  /**
   * Remove a repository from a project
   */
  async removeRepo(projectId, repoId) {
    return this.client.removeProjectRepo(projectId, repoId);
  }
  /**
   * Set the default repository for a project
   */
  async setDefaultRepo(projectId, repoId) {
    return this.client.setDefaultRepo(projectId, repoId);
  }
  /**
   * Get context repositories for a project
   */
  async getContextRepos(projectId) {
    return this.client.getContextRepos(projectId);
  }
  /**
   * Add a mission to a project
   */
  async addMission(projectId, missionId) {
    return this.client.addProjectMission(projectId, missionId);
  }
  /**
   * Remove a mission from a project
   */
  async removeMission(projectId, missionId) {
    return this.client.removeProjectMission(projectId, missionId);
  }
  /**
   * Get project content tree structure from S3
   * @param includeVersions - If true, includes S3 version IDs for files
   * @example ocxp.project.tree('subfolder', 5, true)
   */
  async tree(path, depth, includeVersions) {
    return this.client.tree("project", path, depth, includeVersions);
  }
};
var SessionNamespace = class {
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List sessions with optional filtering
   * @example ocxp.session.list({ status: 'active', limit: 10 })
   */
  async list(options) {
    return this.client.listSessions(options?.limit, options?.status);
  }
  /**
   * Get session messages
   * @example ocxp.session.getMessages('session-id')
   */
  async getMessages(sessionId) {
    return this.client.getSessionMessages(sessionId);
  }
  /**
   * Update session metadata
   */
  async updateMetadata(sessionId, data) {
    return this.client.updateSessionMetadata(sessionId, data);
  }
  /**
   * Fork a session
   */
  async fork(sessionId, missionId, forkPoint) {
    return this.client.forkSession(sessionId, missionId, forkPoint);
  }
  /**
   * Archive a session
   */
  async archive(sessionId) {
    return this.client.archiveSession(sessionId);
  }
};
var KBNamespace = class {
  constructor(client2) {
    this.client = client2;
  }
  /**
   * Query the knowledge base with optional filtering and external docs fallback
   * @example ocxp.kb.query('search term', { searchType: 'HYBRID', maxResults: 10 })
   * @example ocxp.kb.query('authentication', { projectId: 'my-project', missionId: 'CTX-123' })
   * @example ocxp.kb.query('strands agent', { enableFallback: true, persistExternalDocs: true })
   */
  async query(query, options) {
    return this.client.kbQuery(query, options);
  }
  /**
   * RAG query with LLM response and citations
   * @example ocxp.kb.rag('What is OCXP?')
   */
  async rag(query, sessionId) {
    return this.client.kbRag(query, sessionId);
  }
};
var PrototypeNamespace = class {
  constructor(client2) {
    this.client = client2;
  }
  /**
   * List all accessible prototype chats
   * @example ocxp.prototype.list('v0')
   */
  async list(provider) {
    return this.client.listPrototypeChats(provider);
  }
  /**
   * Preview a prototype chat (fetch metadata without linking)
   * @example ocxp.prototype.preview('https://v0.dev/chat/abc123')
   */
  async preview(chatUrl, provider) {
    return this.client.previewPrototypeChat(chatUrl, provider);
  }
  /**
   * Link a prototype chat to a mission
   * @example ocxp.prototype.link({ mission_id: 'xyz', chat_url: 'https://v0.dev/chat/abc123' })
   */
  async link(data) {
    return this.client.linkPrototypeChat(data);
  }
  /**
   * Sync/refresh a linked prototype chat
   * @example ocxp.prototype.sync({ chat_id: 'abc123', mission_id: 'xyz' })
   */
  async sync(data) {
    return this.client.syncPrototypeChat(data);
  }
  /**
   * Get stored prototype chat data
   * @example ocxp.prototype.get('v0', 'abc123')
   */
  async get(provider, chatId, options) {
    return this.client.getPrototypeChat(provider, chatId, options);
  }
  /**
   * Start async prototype chat sync job
   * @example ocxp.prototype.syncAsync({ chat_id: 'abc123', mission_id: 'xyz', download_files: true })
   */
  async syncAsync(data) {
    return this.client.syncPrototypeChatAsync(data);
  }
  /**
   * Get sync job status
   * @example ocxp.prototype.getSyncStatus('job-id')
   */
  async getSyncStatus(jobId) {
    return this.client.getPrototypeSyncStatus(jobId);
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
var MetaSchema = zod.z.object({
  requestId: zod.z.string(),
  timestamp: zod.z.string(),
  durationMs: zod.z.number(),
  operation: zod.z.string()
});
var ErrorResponseSchema = zod.z.object({
  code: zod.z.string(),
  message: zod.z.string(),
  details: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var OCXPResponseSchema = zod.z.object({
  success: zod.z.boolean(),
  data: zod.z.unknown().optional(),
  error: ErrorResponseSchema.nullable().optional(),
  notifications: zod.z.array(zod.z.unknown()).optional(),
  meta: MetaSchema.optional()
});
var PaginationSchema = zod.z.object({
  cursor: zod.z.string().nullable().optional(),
  hasMore: zod.z.boolean(),
  total: zod.z.number()
});
var ContentTypeSchema = zod.z.enum([
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
  return zod.z.object({
    success: zod.z.boolean(),
    data: dataSchema.optional(),
    error: ErrorResponseSchema.nullable().optional(),
    notifications: zod.z.array(zod.z.unknown()).optional(),
    meta: MetaSchema.optional()
  });
}
var ListEntrySchema = zod.z.object({
  name: zod.z.string(),
  type: zod.z.enum(["file", "directory"]),
  path: zod.z.string(),
  size: zod.z.number().optional(),
  mtime: zod.z.string().optional()
});
var ListDataSchema = zod.z.object({
  entries: zod.z.array(ListEntrySchema),
  cursor: zod.z.string().nullable().optional(),
  hasMore: zod.z.boolean().optional().default(false),
  total: zod.z.number().optional().default(0)
});
var ListResponseSchema = createResponseSchema(ListDataSchema);
var ReadDataSchema = zod.z.object({
  content: zod.z.string(),
  size: zod.z.number().optional(),
  mtime: zod.z.string().optional(),
  encoding: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional(),
  etag: zod.z.string().optional()
});
var ReadResponseSchema = createResponseSchema(ReadDataSchema);
var WriteDataSchema = zod.z.object({
  path: zod.z.string(),
  etag: zod.z.string().optional(),
  size: zod.z.number().optional()
});
var WriteResponseSchema = createResponseSchema(WriteDataSchema);
var DeleteDataSchema = zod.z.object({
  path: zod.z.string(),
  deleted: zod.z.boolean().optional().default(true)
});
var DeleteResponseSchema = createResponseSchema(DeleteDataSchema);
var QueryFilterSchema = zod.z.object({
  field: zod.z.string(),
  operator: zod.z.enum(["eq", "ne", "gt", "lt", "gte", "lte", "contains", "startsWith"]),
  value: zod.z.unknown()
});
var QueryDataSchema = zod.z.object({
  items: zod.z.array(zod.z.record(zod.z.string(), zod.z.unknown())),
  cursor: zod.z.string().nullable().optional(),
  hasMore: zod.z.boolean().optional().default(false),
  total: zod.z.number().optional().default(0)
});
var QueryResponseSchema = createResponseSchema(QueryDataSchema);
var SearchDataSchema = zod.z.object({
  results: zod.z.array(
    zod.z.object({
      path: zod.z.string(),
      score: zod.z.number().optional(),
      highlights: zod.z.array(zod.z.string()).optional(),
      content: zod.z.string().optional()
    })
  ),
  total: zod.z.number().optional().default(0)
});
var SearchResponseSchema = createResponseSchema(SearchDataSchema);
var TreeNodeSchema = zod.z.lazy(
  () => zod.z.object({
    name: zod.z.string(),
    path: zod.z.string(),
    type: zod.z.enum(["file", "directory"]),
    size: zod.z.number().optional(),
    version_id: zod.z.string().optional(),
    children: zod.z.array(TreeNodeSchema).optional()
  })
);
var TreeDataSchema = zod.z.object({
  root: TreeNodeSchema,
  depth: zod.z.number().optional()
});
var TreeResponseSchema = createResponseSchema(TreeDataSchema);
var StatsDataSchema = zod.z.object({
  totalFiles: zod.z.number(),
  totalSize: zod.z.number(),
  lastModified: zod.z.string().optional(),
  fileTypes: zod.z.record(zod.z.string(), zod.z.number()).optional()
});
var StatsResponseSchema = createResponseSchema(StatsDataSchema);
var ContentTypeInfoSchema = zod.z.object({
  name: zod.z.string(),
  description: zod.z.string().optional(),
  prefix: zod.z.string().nullable().optional(),
  isVirtual: zod.z.boolean().optional(),
  isGlobal: zod.z.boolean().optional(),
  count: zod.z.number().nullable().optional(),
  endpoints: zod.z.record(zod.z.string(), zod.z.string()).optional()
});
var ContentTypesDataSchema = zod.z.object({
  types: zod.z.array(ContentTypeInfoSchema)
});
var ContentTypesResponseSchema = createResponseSchema(ContentTypesDataSchema);
var PresignedUrlDataSchema = zod.z.object({
  url: zod.z.string(),
  expiresAt: zod.z.string().optional(),
  method: zod.z.enum(["GET", "PUT"]).optional()
});
var PresignedUrlResponseSchema = createResponseSchema(PresignedUrlDataSchema);
var SessionMessageSchema = zod.z.object({
  id: zod.z.string(),
  role: zod.z.enum(["user", "assistant", "system"]),
  content: zod.z.string(),
  timestamp: zod.z.string(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var SessionSchema = zod.z.object({
  id: zod.z.string(),
  missionId: zod.z.string().optional(),
  title: zod.z.string().optional(),
  createdAt: zod.z.string(),
  updatedAt: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional(),
  messageCount: zod.z.number().optional()
});
var ListSessionsDataSchema = zod.z.object({
  sessions: zod.z.array(SessionSchema),
  total: zod.z.number().optional()
});
var ListSessionsResponseSchema = createResponseSchema(ListSessionsDataSchema);
var CreateSessionDataSchema = zod.z.object({
  sessionId: zod.z.string(),
  missionId: zod.z.string().optional()
});
var CreateSessionResponseSchema = createResponseSchema(CreateSessionDataSchema);
var GetSessionMessagesDataSchema = zod.z.object({
  messages: zod.z.array(SessionMessageSchema),
  sessionId: zod.z.string()
});
var GetSessionMessagesResponseSchema = createResponseSchema(GetSessionMessagesDataSchema);
var UpdateSessionMetadataDataSchema = zod.z.object({
  sessionId: zod.z.string(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown())
});
var UpdateSessionMetadataResponseSchema = createResponseSchema(
  UpdateSessionMetadataDataSchema
);
var ForkSessionDataSchema = zod.z.object({
  sessionId: zod.z.string(),
  forkedFromId: zod.z.string()
});
var ForkSessionResponseSchema = createResponseSchema(ForkSessionDataSchema);
var ProjectRepoSchema = zod.z.object({
  repoId: zod.z.string(),
  isDefault: zod.z.boolean().optional(),
  addedAt: zod.z.string().optional()
});
var ProjectMissionSchema = zod.z.object({
  missionId: zod.z.string(),
  addedAt: zod.z.string().optional()
});
var ProjectSchema = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  description: zod.z.string().optional(),
  createdAt: zod.z.string(),
  updatedAt: zod.z.string().optional(),
  repos: zod.z.array(ProjectRepoSchema).optional(),
  missions: zod.z.array(ProjectMissionSchema).optional(),
  defaultRepoId: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var ListProjectsDataSchema = zod.z.object({
  projects: zod.z.array(ProjectSchema),
  total: zod.z.number().optional()
});
var ListProjectsResponseSchema = createResponseSchema(ListProjectsDataSchema);
var CreateProjectDataSchema = zod.z.object({
  projectId: zod.z.string(),
  project: ProjectSchema.optional()
});
var CreateProjectResponseSchema = createResponseSchema(CreateProjectDataSchema);
var GetProjectDataSchema = ProjectSchema;
var GetProjectResponseSchema = createResponseSchema(GetProjectDataSchema);
var UpdateProjectDataSchema = zod.z.object({
  projectId: zod.z.string(),
  project: ProjectSchema.optional()
});
var UpdateProjectResponseSchema = createResponseSchema(UpdateProjectDataSchema);
var DeleteProjectDataSchema = zod.z.object({
  projectId: zod.z.string(),
  deleted: zod.z.boolean()
});
var DeleteProjectResponseSchema = createResponseSchema(DeleteProjectDataSchema);
var AddProjectRepoDataSchema = zod.z.object({
  projectId: zod.z.string(),
  repoId: zod.z.string()
});
var AddProjectRepoResponseSchema = createResponseSchema(AddProjectRepoDataSchema);
var ContextReposDataSchema = zod.z.object({
  repos: zod.z.array(
    zod.z.object({
      repoId: zod.z.string(),
      name: zod.z.string().optional(),
      isDefault: zod.z.boolean().optional()
    })
  )
});
var ContextReposResponseSchema = createResponseSchema(ContextReposDataSchema);
var RepoStatusEnum = zod.z.enum([
  "queued",
  "processing",
  "uploading",
  "vectorizing",
  "complete",
  "failed"
]);
var RepoDownloadRequestSchema = zod.z.object({
  github_url: zod.z.string(),
  repo_id: zod.z.string(),
  branch: zod.z.string().optional().default("main"),
  path: zod.z.string().nullable().optional(),
  mode: zod.z.enum(["full", "docs_only"]).optional().default("full"),
  include_extensions: zod.z.array(zod.z.string()).optional(),
  exclude_patterns: zod.z.array(zod.z.string()).optional(),
  max_file_size_kb: zod.z.number().min(1).max(5e3).optional().default(500),
  visibility: zod.z.enum(["private", "public"]).optional().default("private"),
  trigger_vectorization: zod.z.boolean().optional().default(true),
  generate_metadata: zod.z.boolean().optional().default(true),
  is_private: zod.z.boolean().optional().default(false)
});
var RepoDownloadDataSchema = zod.z.object({
  repo_id: zod.z.string(),
  job_id: zod.z.string(),
  s3_path: zod.z.string().optional(),
  status: RepoStatusEnum,
  files_processed: zod.z.number().optional(),
  metadata_files_created: zod.z.number().optional(),
  ingestion_job_id: zod.z.string().nullable().optional()
});
var RepoDownloadResponseSchema = createResponseSchema(RepoDownloadDataSchema);
var RepoStatusDataSchema = zod.z.object({
  job_id: zod.z.string(),
  status: RepoStatusEnum,
  progress: zod.z.number().min(0).max(100).optional(),
  files_processed: zod.z.number().optional(),
  total_files: zod.z.number().optional(),
  error: zod.z.string().nullable().optional(),
  started_at: zod.z.string().nullable().optional(),
  completed_at: zod.z.string().nullable().optional()
});
var RepoStatusResponseSchema = createResponseSchema(RepoStatusDataSchema);
var RepoListItemSchema = zod.z.object({
  repo_id: zod.z.string(),
  github_url: zod.z.string().optional(),
  branch: zod.z.string().optional(),
  visibility: zod.z.enum(["private", "public"]).optional(),
  mode: zod.z.enum(["full", "docs_only"]).optional(),
  files_count: zod.z.number().optional(),
  last_synced: zod.z.string().optional(),
  s3_path: zod.z.string().optional()
});
var RepoListDataSchema = zod.z.object({
  repos: zod.z.array(RepoListItemSchema),
  total: zod.z.number().optional()
});
var RepoListResponseSchema = createResponseSchema(RepoListDataSchema);
var RepoExistsDataSchema = zod.z.object({
  repo_id: zod.z.string(),
  exists: zod.z.boolean(),
  indexed_at: zod.z.string().nullable().optional(),
  files_count: zod.z.number().optional()
});
var RepoExistsResponseSchema = createResponseSchema(RepoExistsDataSchema);
var RepoDeleteDataSchema = zod.z.object({
  repo_id: zod.z.string(),
  success: zod.z.boolean(),
  s3_files_deleted: zod.z.number().optional(),
  projects_updated: zod.z.number().optional(),
  error: zod.z.string().optional()
});
var RepoDeleteResponseSchema = createResponseSchema(RepoDeleteDataSchema);
var AuthTokenDataSchema = zod.z.object({
  accessToken: zod.z.string(),
  tokenType: zod.z.string().optional().default("Bearer"),
  expiresIn: zod.z.number().optional(),
  expiresAt: zod.z.string().optional(),
  refreshToken: zod.z.string().optional(),
  scope: zod.z.string().optional()
});
var AuthTokenResponseSchema = createResponseSchema(AuthTokenDataSchema);
var AuthUserInfoSchema = zod.z.object({
  userId: zod.z.string(),
  email: zod.z.string().optional(),
  name: zod.z.string().optional(),
  roles: zod.z.array(zod.z.string()).optional(),
  permissions: zod.z.array(zod.z.string()).optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var AuthUserInfoResponseSchema = createResponseSchema(AuthUserInfoSchema);
var AuthValidateDataSchema = zod.z.object({
  valid: zod.z.boolean(),
  userId: zod.z.string().optional(),
  expiresAt: zod.z.string().optional()
});
var AuthValidateResponseSchema = createResponseSchema(AuthValidateDataSchema);
var SearchResultItemSchema = zod.z.object({
  id: zod.z.string(),
  path: zod.z.string().optional(),
  content: zod.z.string().optional(),
  score: zod.z.number().optional(),
  highlights: zod.z.array(zod.z.string()).optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional(),
  source: zod.z.string().optional(),
  type: zod.z.string().optional()
});
var VectorSearchDataSchema = zod.z.object({
  results: zod.z.array(SearchResultItemSchema),
  total: zod.z.number().optional(),
  query: zod.z.string().optional(),
  processingTimeMs: zod.z.number().optional()
});
var VectorSearchResponseSchema = createResponseSchema(VectorSearchDataSchema);
var KBDocumentSchema = zod.z.object({
  id: zod.z.string(),
  title: zod.z.string().optional(),
  content: zod.z.string(),
  path: zod.z.string().optional(),
  source: zod.z.string().optional(),
  createdAt: zod.z.string().optional(),
  updatedAt: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional(),
  vectorId: zod.z.string().optional()
});
var KBListDataSchema = zod.z.object({
  documents: zod.z.array(KBDocumentSchema),
  total: zod.z.number().optional(),
  cursor: zod.z.string().nullable().optional(),
  hasMore: zod.z.boolean().optional()
});
var KBListResponseSchema = createResponseSchema(KBListDataSchema);
var KBIngestDataSchema = zod.z.object({
  documentId: zod.z.string(),
  vectorId: zod.z.string().optional(),
  chunksCreated: zod.z.number().optional(),
  status: zod.z.enum(["pending", "processing", "complete", "failed"]).optional()
});
var KBIngestResponseSchema = createResponseSchema(KBIngestDataSchema);
var DiscoveryEndpointSchema = zod.z.object({
  name: zod.z.string(),
  path: zod.z.string(),
  methods: zod.z.array(zod.z.string()),
  description: zod.z.string().optional(),
  parameters: zod.z.array(zod.z.record(zod.z.string(), zod.z.unknown())).optional()
});
var DiscoveryDataSchema = zod.z.object({
  version: zod.z.string().optional(),
  endpoints: zod.z.array(DiscoveryEndpointSchema),
  contentTypes: zod.z.array(zod.z.string()).optional(),
  capabilities: zod.z.array(zod.z.string()).optional()
});
var DiscoveryResponseSchema = createResponseSchema(DiscoveryDataSchema);
var IngestionJobSchema = zod.z.object({
  jobId: zod.z.string(),
  status: zod.z.enum(["queued", "processing", "complete", "failed"]),
  progress: zod.z.number().min(0).max(100).optional(),
  documentsProcessed: zod.z.number().optional(),
  totalDocuments: zod.z.number().optional(),
  error: zod.z.string().nullable().optional(),
  startedAt: zod.z.string().nullable().optional(),
  completedAt: zod.z.string().nullable().optional()
});
var IngestionJobResponseSchema = createResponseSchema(IngestionJobSchema);
var WSMessageTypeSchema = zod.z.enum([
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
var WSBaseMessageSchema = zod.z.object({
  type: WSMessageTypeSchema,
  id: zod.z.string().optional(),
  timestamp: zod.z.string().optional(),
  sessionId: zod.z.string().optional()
});
var WSChatMessageSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("chat"),
  content: zod.z.string(),
  missionId: zod.z.string().optional(),
  projectId: zod.z.string().optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var WSChatResponseSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("chat_response"),
  content: zod.z.string(),
  role: zod.z.enum(["assistant", "system"]).optional(),
  metadata: zod.z.record(zod.z.string(), zod.z.unknown()).optional(),
  usage: zod.z.object({
    promptTokens: zod.z.number().optional(),
    completionTokens: zod.z.number().optional(),
    totalTokens: zod.z.number().optional()
  }).optional()
});
var WSStreamStartSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("stream_start"),
  streamId: zod.z.string()
});
var WSStreamChunkSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("stream_chunk"),
  streamId: zod.z.string(),
  content: zod.z.string(),
  index: zod.z.number().optional()
});
var WSStreamEndSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("stream_end"),
  streamId: zod.z.string(),
  usage: zod.z.object({
    promptTokens: zod.z.number().optional(),
    completionTokens: zod.z.number().optional(),
    totalTokens: zod.z.number().optional()
  }).optional()
});
var WSErrorMessageSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("error"),
  code: zod.z.string(),
  message: zod.z.string(),
  details: zod.z.record(zod.z.string(), zod.z.unknown()).optional()
});
var WSPingPongSchema = WSBaseMessageSchema.extend({
  type: zod.z.enum(["ping", "pong"])
});
var WSConnectedSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("connected"),
  connectionId: zod.z.string().optional(),
  serverVersion: zod.z.string().optional()
});
var WSStatusSchema = WSBaseMessageSchema.extend({
  type: zod.z.literal("status"),
  status: zod.z.enum(["ready", "busy", "processing", "idle"]),
  message: zod.z.string().optional()
});
var WSMessageSchema = zod.z.discriminatedUnion("type", [
  WSChatMessageSchema,
  WSChatResponseSchema,
  WSStreamStartSchema,
  WSStreamChunkSchema,
  WSStreamEndSchema,
  WSErrorMessageSchema,
  WSPingPongSchema.extend({ type: zod.z.literal("ping") }),
  WSPingPongSchema.extend({ type: zod.z.literal("pong") }),
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
      error: new zod.z.ZodError([
        {
          code: "custom",
          message: "Invalid JSON",
          path: []
        }
      ])
    };
  }
}
var GithubFileInfoSchema = zod.z.object({
  name: zod.z.string(),
  path: zod.z.string(),
  sha: zod.z.string(),
  size: zod.z.number(),
  type: zod.z.enum(["file", "dir", "symlink", "submodule"]),
  url: zod.z.string().optional(),
  html_url: zod.z.string().optional(),
  git_url: zod.z.string().optional(),
  download_url: zod.z.string().nullable().optional(),
  content: zod.z.string().optional(),
  encoding: zod.z.string().optional()
});
var GithubRepoInfoSchema = zod.z.object({
  id: zod.z.number(),
  name: zod.z.string(),
  full_name: zod.z.string(),
  private: zod.z.boolean(),
  owner: zod.z.object({
    login: zod.z.string(),
    id: zod.z.number(),
    avatar_url: zod.z.string().optional(),
    type: zod.z.string().optional()
  }),
  html_url: zod.z.string(),
  description: zod.z.string().nullable().optional(),
  fork: zod.z.boolean().optional(),
  created_at: zod.z.string().optional(),
  updated_at: zod.z.string().optional(),
  pushed_at: zod.z.string().optional(),
  size: zod.z.number().optional(),
  stargazers_count: zod.z.number().optional(),
  watchers_count: zod.z.number().optional(),
  language: zod.z.string().nullable().optional(),
  default_branch: zod.z.string().optional(),
  visibility: zod.z.string().optional()
});
var GithubBranchInfoSchema = zod.z.object({
  name: zod.z.string(),
  commit: zod.z.object({
    sha: zod.z.string(),
    url: zod.z.string().optional()
  }),
  protected: zod.z.boolean().optional()
});
var GithubCommitInfoSchema = zod.z.object({
  sha: zod.z.string(),
  message: zod.z.string().optional(),
  author: zod.z.object({
    name: zod.z.string().optional(),
    email: zod.z.string().optional(),
    date: zod.z.string().optional()
  }).optional(),
  committer: zod.z.object({
    name: zod.z.string().optional(),
    email: zod.z.string().optional(),
    date: zod.z.string().optional()
  }).optional(),
  url: zod.z.string().optional(),
  html_url: zod.z.string().optional()
});
var GithubFileDataSchema = zod.z.object({
  file: GithubFileInfoSchema,
  content: zod.z.string().optional(),
  encoding: zod.z.string().optional()
});
var GithubFileResponseSchema = createResponseSchema(GithubFileDataSchema);
var GithubDirectoryDataSchema = zod.z.object({
  entries: zod.z.array(GithubFileInfoSchema),
  path: zod.z.string()
});
var GithubDirectoryResponseSchema = createResponseSchema(GithubDirectoryDataSchema);
var GithubRepoDataSchema = zod.z.object({
  repository: GithubRepoInfoSchema
});
var GithubRepoResponseSchema = createResponseSchema(GithubRepoDataSchema);
var GithubBranchesDataSchema = zod.z.object({
  branches: zod.z.array(GithubBranchInfoSchema)
});
var GithubBranchesResponseSchema = createResponseSchema(GithubBranchesDataSchema);
var GithubCommitsDataSchema = zod.z.object({
  commits: zod.z.array(GithubCommitInfoSchema)
});
var GithubCommitsResponseSchema = createResponseSchema(GithubCommitsDataSchema);

exports.AddProjectRepoDataSchema = AddProjectRepoDataSchema;
exports.AddProjectRepoResponseSchema = AddProjectRepoResponseSchema;
exports.AuthTokenDataSchema = AuthTokenDataSchema;
exports.AuthTokenResponseSchema = AuthTokenResponseSchema;
exports.AuthUserInfoResponseSchema = AuthUserInfoResponseSchema;
exports.AuthUserInfoSchema = AuthUserInfoSchema;
exports.AuthValidateDataSchema = AuthValidateDataSchema;
exports.AuthValidateResponseSchema = AuthValidateResponseSchema;
exports.ContentTypeInfoSchema = ContentTypeInfoSchema;
exports.ContentTypeSchema = ContentTypeSchema;
exports.ContentTypesDataSchema = ContentTypesDataSchema;
exports.ContentTypesResponseSchema = ContentTypesResponseSchema;
exports.ContextReposDataSchema = ContextReposDataSchema;
exports.ContextReposResponseSchema = ContextReposResponseSchema;
exports.CreateProjectDataSchema = CreateProjectDataSchema;
exports.CreateProjectResponseSchema = CreateProjectResponseSchema;
exports.CreateSessionDataSchema = CreateSessionDataSchema;
exports.CreateSessionResponseSchema = CreateSessionResponseSchema;
exports.DeleteDataSchema = DeleteDataSchema;
exports.DeleteProjectDataSchema = DeleteProjectDataSchema;
exports.DeleteProjectResponseSchema = DeleteProjectResponseSchema;
exports.DeleteResponseSchema = DeleteResponseSchema;
exports.DiscoveryDataSchema = DiscoveryDataSchema;
exports.DiscoveryEndpointSchema = DiscoveryEndpointSchema;
exports.DiscoveryResponseSchema = DiscoveryResponseSchema;
exports.ErrorResponseSchema = ErrorResponseSchema;
exports.ForkSessionDataSchema = ForkSessionDataSchema;
exports.ForkSessionResponseSchema = ForkSessionResponseSchema;
exports.GetProjectDataSchema = GetProjectDataSchema;
exports.GetProjectResponseSchema = GetProjectResponseSchema;
exports.GetSessionMessagesDataSchema = GetSessionMessagesDataSchema;
exports.GetSessionMessagesResponseSchema = GetSessionMessagesResponseSchema;
exports.GithubBranchInfoSchema = GithubBranchInfoSchema;
exports.GithubBranchesDataSchema = GithubBranchesDataSchema;
exports.GithubBranchesResponseSchema = GithubBranchesResponseSchema;
exports.GithubCommitInfoSchema = GithubCommitInfoSchema;
exports.GithubCommitsDataSchema = GithubCommitsDataSchema;
exports.GithubCommitsResponseSchema = GithubCommitsResponseSchema;
exports.GithubDirectoryDataSchema = GithubDirectoryDataSchema;
exports.GithubDirectoryResponseSchema = GithubDirectoryResponseSchema;
exports.GithubFileDataSchema = GithubFileDataSchema;
exports.GithubFileInfoSchema = GithubFileInfoSchema;
exports.GithubFileResponseSchema = GithubFileResponseSchema;
exports.GithubRepoDataSchema = GithubRepoDataSchema;
exports.GithubRepoInfoSchema = GithubRepoInfoSchema;
exports.GithubRepoResponseSchema = GithubRepoResponseSchema;
exports.IngestionJobResponseSchema = IngestionJobResponseSchema;
exports.IngestionJobSchema = IngestionJobSchema;
exports.KBDocumentSchema = KBDocumentSchema;
exports.KBIngestDataSchema = KBIngestDataSchema;
exports.KBIngestResponseSchema = KBIngestResponseSchema;
exports.KBListDataSchema = KBListDataSchema;
exports.KBListResponseSchema = KBListResponseSchema;
exports.KBNamespace = KBNamespace;
exports.ListDataSchema = ListDataSchema;
exports.ListEntrySchema = ListEntrySchema;
exports.ListProjectsDataSchema = ListProjectsDataSchema;
exports.ListProjectsResponseSchema = ListProjectsResponseSchema;
exports.ListResponseSchema = ListResponseSchema;
exports.ListSessionsDataSchema = ListSessionsDataSchema;
exports.ListSessionsResponseSchema = ListSessionsResponseSchema;
exports.MetaSchema = MetaSchema;
exports.MissionNamespace = MissionNamespace;
exports.OCXPAuthError = OCXPAuthError;
exports.OCXPClient = OCXPClient;
exports.OCXPConflictError = OCXPConflictError;
exports.OCXPError = OCXPError;
exports.OCXPErrorCode = OCXPErrorCode;
exports.OCXPNetworkError = OCXPNetworkError;
exports.OCXPNotFoundError = OCXPNotFoundError;
exports.OCXPPathService = OCXPPathService;
exports.OCXPRateLimitError = OCXPRateLimitError;
exports.OCXPResponseSchema = OCXPResponseSchema;
exports.OCXPTimeoutError = OCXPTimeoutError;
exports.OCXPValidationError = OCXPValidationError;
exports.PaginationSchema = PaginationSchema;
exports.PresignedUrlDataSchema = PresignedUrlDataSchema;
exports.PresignedUrlResponseSchema = PresignedUrlResponseSchema;
exports.ProjectMissionSchema = ProjectMissionSchema;
exports.ProjectNamespace = ProjectNamespace;
exports.ProjectRepoSchema = ProjectRepoSchema;
exports.ProjectSchema = ProjectSchema;
exports.PrototypeNamespace = PrototypeNamespace;
exports.QueryDataSchema = QueryDataSchema;
exports.QueryFilterSchema = QueryFilterSchema;
exports.QueryResponseSchema = QueryResponseSchema;
exports.ReadDataSchema = ReadDataSchema;
exports.ReadResponseSchema = ReadResponseSchema;
exports.RepoDeleteDataSchema = RepoDeleteDataSchema;
exports.RepoDeleteResponseSchema = RepoDeleteResponseSchema;
exports.RepoDownloadDataSchema = RepoDownloadDataSchema;
exports.RepoDownloadRequestSchema = RepoDownloadRequestSchema;
exports.RepoDownloadResponseSchema = RepoDownloadResponseSchema;
exports.RepoExistsDataSchema = RepoExistsDataSchema;
exports.RepoExistsResponseSchema = RepoExistsResponseSchema;
exports.RepoListDataSchema = RepoListDataSchema;
exports.RepoListItemSchema = RepoListItemSchema;
exports.RepoListResponseSchema = RepoListResponseSchema;
exports.RepoStatusDataSchema = RepoStatusDataSchema;
exports.RepoStatusEnum = RepoStatusEnum;
exports.RepoStatusResponseSchema = RepoStatusResponseSchema;
exports.SearchDataSchema = SearchDataSchema;
exports.SearchResponseSchema = SearchResponseSchema;
exports.SearchResultItemSchema = SearchResultItemSchema;
exports.SessionMessageSchema = SessionMessageSchema;
exports.SessionNamespace = SessionNamespace;
exports.SessionSchema = SessionSchema;
exports.StatsDataSchema = StatsDataSchema;
exports.StatsResponseSchema = StatsResponseSchema;
exports.TreeDataSchema = TreeDataSchema;
exports.TreeNodeSchema = TreeNodeSchema;
exports.TreeResponseSchema = TreeResponseSchema;
exports.UpdateProjectDataSchema = UpdateProjectDataSchema;
exports.UpdateProjectResponseSchema = UpdateProjectResponseSchema;
exports.UpdateSessionMetadataDataSchema = UpdateSessionMetadataDataSchema;
exports.UpdateSessionMetadataResponseSchema = UpdateSessionMetadataResponseSchema;
exports.VALID_CONTENT_TYPES = VALID_CONTENT_TYPES;
exports.VectorSearchDataSchema = VectorSearchDataSchema;
exports.VectorSearchResponseSchema = VectorSearchResponseSchema;
exports.WSBaseMessageSchema = WSBaseMessageSchema;
exports.WSChatMessageSchema = WSChatMessageSchema;
exports.WSChatResponseSchema = WSChatResponseSchema;
exports.WSConnectedSchema = WSConnectedSchema;
exports.WSErrorMessageSchema = WSErrorMessageSchema;
exports.WSMessageSchema = WSMessageSchema;
exports.WSMessageTypeSchema = WSMessageTypeSchema;
exports.WSPingPongSchema = WSPingPongSchema;
exports.WSStatusSchema = WSStatusSchema;
exports.WSStreamChunkSchema = WSStreamChunkSchema;
exports.WSStreamEndSchema = WSStreamEndSchema;
exports.WSStreamStartSchema = WSStreamStartSchema;
exports.WebSocketService = WebSocketService;
exports.WriteDataSchema = WriteDataSchema;
exports.WriteResponseSchema = WriteResponseSchema;
exports.acknowledgeMemo = acknowledgeMemo;
exports.addDatabase = addDatabase;
exports.addLinkedRepo = addLinkedRepo;
exports.addMission = addMission;
exports.archiveSession = archiveSession;
exports.buildPath = buildPath;
exports.bulkDeleteContent = bulkDeleteContent;
exports.bulkReadContent = bulkReadContent;
exports.bulkWriteContent = bulkWriteContent;
exports.createClient = createClient;
exports.createConfig = createConfig;
exports.createDatabase = createDatabase;
exports.createMemo = createMemo;
exports.createOCXPClient = createOCXPClient;
exports.createPathService = createPathService;
exports.createProject = createProject;
exports.createResponseSchema = createResponseSchema;
exports.createWebSocketService = createWebSocketService;
exports.deleteContent = deleteContent;
exports.deleteDatabase = deleteDatabase;
exports.deleteMemo = deleteMemo;
exports.deleteProject = deleteProject;
exports.deleteRepo = deleteRepo;
exports.downloadRepository = downloadRepository;
exports.forkSession = forkSession;
exports.getAuthConfig = getAuthConfig;
exports.getCanonicalType = getCanonicalType;
exports.getContentStats = getContentStats;
exports.getContentTree = getContentTree;
exports.getContentTypes = getContentTypes;
exports.getContextRepos = getContextRepos;
exports.getCurrentUser = getCurrentUser;
exports.getDatabase = getDatabase;
exports.getMemo = getMemo;
exports.getMemoForSource = getMemoForSource;
exports.getMissionContext = getMissionContext;
exports.getProject = getProject;
exports.getProjectDatabases = getProjectDatabases;
exports.getPrototypeChat = getPrototypeChat;
exports.getRepoDownloadStatus = getRepoDownloadStatus;
exports.getSample = getSample;
exports.getSchema = getSchema;
exports.getSessionMessages = getSessionMessages;
exports.getSyncStatus = getSyncStatus;
exports.githubCheckAccess = githubCheckAccess;
exports.githubGetContents = githubGetContents;
exports.githubListBranches = githubListBranches;
exports.ignoreMemo = ignoreMemo;
exports.isOCXPAuthError = isOCXPAuthError;
exports.isOCXPConflictError = isOCXPConflictError;
exports.isOCXPError = isOCXPError;
exports.isOCXPNetworkError = isOCXPNetworkError;
exports.isOCXPNotFoundError = isOCXPNotFoundError;
exports.isOCXPRateLimitError = isOCXPRateLimitError;
exports.isOCXPTimeoutError = isOCXPTimeoutError;
exports.isOCXPValidationError = isOCXPValidationError;
exports.isValidContentType = isValidContentType;
exports.linkPrototypeChat = linkPrototypeChat;
exports.listContent = listContent;
exports.listContextDatabases = listContextDatabases;
exports.listDatabases = listDatabases;
exports.listDownloadedRepos = listDownloadedRepos;
exports.listMemos = listMemos;
exports.listProjects = listProjects;
exports.listPrototypeChats = listPrototypeChats;
exports.listSessions = listSessions;
exports.listTables = listTables;
exports.listWorkspaces = listWorkspaces;
exports.lockContent = lockContent;
exports.login = login;
exports.loginForAccessToken = loginForAccessToken;
exports.mapHttpError = mapHttpError;
exports.moveContent = moveContent;
exports.normalizePath = normalizePath;
exports.parsePath = parsePath;
exports.parseWSMessage = parseWSMessage;
exports.previewPrototypeChat = previewPrototypeChat;
exports.queryContent = queryContent;
exports.queryKnowledgeBase = queryKnowledgeBase;
exports.ragKnowledgeBase = ragKnowledgeBase;
exports.readContent = readContent;
exports.refreshTokens = refreshTokens;
exports.regenerateMission = regenerateMission;
exports.removeDatabase = removeDatabase;
exports.removeLinkedRepo = removeLinkedRepo;
exports.removeMission = removeMission;
exports.resolveMemo = resolveMemo;
exports.safeParseWSMessage = safeParseWSMessage;
exports.searchContent = searchContent;
exports.setDefaultDatabase = setDefaultDatabase;
exports.setDefaultRepo = setDefaultRepo;
exports.syncPrototypeChat = syncPrototypeChat;
exports.syncPrototypeChatAsync = syncPrototypeChatAsync;
exports.testDatabaseConnection = testDatabaseConnection;
exports.toolCreateMission = toolCreateMission;
exports.toolUpdateMission = toolUpdateMission;
exports.unlockContent = unlockContent;
exports.updateDatabase = updateDatabase;
exports.updateProject = updateProject;
exports.updateSessionMetadata = updateSessionMetadata;
exports.writeContent = writeContent;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map