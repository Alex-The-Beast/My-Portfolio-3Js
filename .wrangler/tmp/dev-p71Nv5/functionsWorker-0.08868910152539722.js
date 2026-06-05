var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-ttlPOb/functionsWorker-0.08868910152539722.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var notionVersion = "2026-03-11";
var propertyNames;
var requiredEnv = /* @__PURE__ */ __name2((env, key) => {
  const value = env[key];
  if (!value) throw new Error(`Missing ${key}. Add it to your Cloudflare Pages environment variables.`);
  return value;
}, "requiredEnv");
var notionFetch = /* @__PURE__ */ __name2(async (env, endpoint, options = {}) => {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${requiredEnv(env, "NOTION_TOKEN")}`,
      "Content-Type": "application/json",
      "Notion-Version": notionVersion,
      ...options.headers
    }
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(`Notion API error ${response.status}: ${data.message || JSON.stringify(data)}`);
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
}, "notionFetch");
var loadPropertyNames = /* @__PURE__ */ __name2((env) => {
  propertyNames = {
    title: env.NOTION_TITLE_PROPERTY || "Name",
    slug: env.NOTION_SLUG_PROPERTY || "Slug",
    category: env.NOTION_CATEGORY_PROPERTY || "Category",
    status: env.NOTION_STATUS_PROPERTY || "Status",
    date: env.NOTION_DATE_PROPERTY || "Created Date",
    updatedAt: env.NOTION_UPDATED_AT_PROPERTY || "updated",
    summary: env.NOTION_SUMMARY_PROPERTY || "Summary",
    focus: env.NOTION_FOCUS_PROPERTY || "Focus",
    tags: env.NOTION_TAGS_PROPERTY || "Tags",
    published: env.NOTION_PUBLISHED_PROPERTY || "Published"
  };
}, "loadPropertyNames");
var plainText = /* @__PURE__ */ __name2((richText = []) => richText.map((item) => item.plain_text).join("").trim(), "plainText");
var getTitle = /* @__PURE__ */ __name2((properties) => {
  const titleProperty = Object.values(properties).find(
    (property) => property?.type === "title"
  );
  return plainText(titleProperty?.title) || "Untitled update";
}, "getTitle");
var slugify = /* @__PURE__ */ __name2((value) => value.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), "slugify");
var getSlugValue = /* @__PURE__ */ __name2((property) => {
  if (!property) return "";
  if (property.type === "rich_text") return plainText(property.rich_text);
  if (property.type === "title") return plainText(property.title);
  if (property.type === "formula") return String(property.formula?.string || property.formula?.number || "");
  if (property.type === "select") return property.select?.name || "";
  return "";
}, "getSlugValue");
var getSlug = /* @__PURE__ */ __name2((properties, title, pageId) => {
  const rawSlug = getSlugValue(properties[propertyNames.slug]);
  const slug = slugify(rawSlug || title);
  const fallback = pageId.replace(/-/g, "").slice(-8);
  return slug || fallback;
}, "getSlug");
var getRichText = /* @__PURE__ */ __name2((properties, name) => plainText(properties[name]?.rich_text), "getRichText");
var getSelectName = /* @__PURE__ */ __name2((property) => property?.select?.name || property?.status?.name || "", "getSelectName");
var getMultiSelect = /* @__PURE__ */ __name2((property) => property?.multi_select?.map((item) => item.name) || [], "getMultiSelect");
var formatDate = /* @__PURE__ */ __name2((env, rawDate) => {
  if (!rawDate) return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  return new Date(rawDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: env.NOTION_DATE_TIME_ZONE || "Asia/Kolkata"
  });
}, "formatDate");
var getPropertyDate = /* @__PURE__ */ __name2((properties, name) => {
  const property = properties[name];
  return property?.date?.start || property?.created_time || property?.last_edited_time || "";
}, "getPropertyDate");
var getPublishedAt = /* @__PURE__ */ __name2((env, properties, page) => formatDate(env, getPropertyDate(properties, propertyNames.date) || page.created_time), "getPublishedAt");
var getUpdatedAt = /* @__PURE__ */ __name2((env, properties, page) => formatDate(env, getPropertyDate(properties, propertyNames.updatedAt) || page.last_edited_time), "getUpdatedAt");
var getBlockText = /* @__PURE__ */ __name2((block) => {
  const value = block[block.type];
  return plainText(value?.rich_text);
}, "getBlockText");
var getFileObjectUrl = /* @__PURE__ */ __name2((fileObject) => {
  if (!fileObject) return "";
  if (fileObject.type === "external") return fileObject.external?.url || "";
  if (fileObject.type === "file") return fileObject.file?.url || "";
  return "";
}, "getFileObjectUrl");
var getMissingMediaReason = /* @__PURE__ */ __name2((fileObject) => {
  if (!fileObject) return "Notion returned this media block without file data.";
  if (fileObject.type === "file_upload") return "Notion returned a file_upload reference instead of a public download URL.";
  if (!fileObject.type) return "This looks like an empty Notion image placeholder.";
  return `Notion returned unsupported media type: ${fileObject.type}.`;
}, "getMissingMediaReason");
var normalizeBlock = /* @__PURE__ */ __name2((block) => {
  const text = getBlockText(block);
  switch (block.type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return { type: "heading", text };
    case "paragraph":
      return text ? { type: "paragraph", text } : null;
    case "bulleted_list_item":
      return text ? { type: "bullet", text } : null;
    case "numbered_list_item":
      return text ? { type: "numbered", text } : null;
    case "to_do":
      return text ? { type: "todo", text, checked: Boolean(block.to_do?.checked) } : null;
    case "code":
      return { type: "code", language: block.code?.language || "text", text };
    case "quote":
      return text ? { type: "quote", text } : null;
    case "callout":
      return text ? { type: "callout", text } : null;
    case "image": {
      const caption = plainText(block.image?.caption);
      console.log(JSON.stringify(block.image, null, 2));
      const url = getFileObjectUrl(block.image);
      return {
        type: url ? "image" : "image_placeholder",
        url,
        caption,
        notionMediaType: block.image?.type || "",
        reason: url ? "" : getMissingMediaReason(block.image)
      };
    }
    case "file": {
      const caption = plainText(block.file?.caption);
      const url = getFileObjectUrl(block.file);
      return {
        type: url ? "file" : "file_placeholder",
        url,
        caption: caption || block.file?.name || "Attached file",
        notionMediaType: block.file?.type || "",
        reason: url ? "" : getMissingMediaReason(block.file)
      };
    }
    case "divider":
      return { type: "divider" };
    default:
      return text ? { type: "paragraph", text } : null;
  }
}, "normalizeBlock");
var getPageBlocks = /* @__PURE__ */ __name2(async (env, pageId) => {
  const blocks = [];
  let startCursor;
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (startCursor) query.set("start_cursor", startCursor);
    const data = await notionFetch(env, `/blocks/${pageId}/children?${query.toString()}`);
    blocks.push(...data.results.map(normalizeBlock).filter(Boolean));
    startCursor = data.has_more ? data.next_cursor : null;
  } while (startCursor);
  return blocks;
}, "getPageBlocks");
var getFirstDataSourceFromDatabase = /* @__PURE__ */ __name2(async (env, databaseId) => {
  const database = await notionFetch(env, `/databases/${databaseId}`);
  const dataSourceId = database.data_sources?.[0]?.id;
  if (!dataSourceId) {
    throw new Error(
      "No data source found in that Notion database. Share the database with your integration, then set NOTION_DATA_SOURCE_ID directly if needed."
    );
  }
  return dataSourceId;
}, "getFirstDataSourceFromDatabase");
var getDataSourceId = /* @__PURE__ */ __name2(async (env) => {
  const explicitDataSourceId = env.NOTION_DATA_SOURCE_ID;
  if (explicitDataSourceId) {
    try {
      await notionFetch(env, `/data_sources/${explicitDataSourceId}`);
      return explicitDataSourceId;
    } catch (error) {
      if (error.status !== 404) throw error;
      return getFirstDataSourceFromDatabase(env, explicitDataSourceId);
    }
  }
  return getFirstDataSourceFromDatabase(env, requiredEnv(env, "NOTION_DATABASE_ID"));
}, "getDataSourceId");
var queryPages = /* @__PURE__ */ __name2(async (env, dataSourceId) => {
  const body = {
    page_size: Number(env.NOTION_PAGE_SIZE || 50),
    result_type: "page",
    sorts: [{ timestamp: "last_edited_time", direction: "descending" }]
  };
  if (propertyNames.published) {
    body.filter = {
      property: propertyNames.published,
      checkbox: { equals: true }
    };
  }
  try {
    return await notionFetch(env, `/data_sources/${dataSourceId}/query`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  } catch (error) {
    if (!body.filter || error.status === 404) throw error;
    delete body.filter;
    return notionFetch(env, `/data_sources/${dataSourceId}/query`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
}, "queryPages");
var pageToUpdate = /* @__PURE__ */ __name2(async (env, page) => {
  const blocks = await getPageBlocks(env, page.id);
  const properties = page.properties || {};
  const title = getTitle(properties);
  const blockNotes = blocks.filter((block) => ["bullet", "numbered", "todo", "note"].includes(block.type)).map((block) => block.text);
  const paragraphFallback = blocks.filter((block) => block.type === "paragraph").map((block) => block.text);
  const summary = getRichText(properties, propertyNames.summary) || paragraphFallback[0] || "";
  return {
    id: page.id,
    date: getPublishedAt(env, properties, page),
    publishedAt: getPublishedAt(env, properties, page),
    updatedAt: getUpdatedAt(env, properties, page),
    title,
    slug: getSlug(properties, title, page.id),
    category: getSelectName(properties[propertyNames.category]) || "Learning",
    status: getSelectName(properties[propertyNames.status]) || "Updated",
    summary,
    notes: blockNotes.length ? blockNotes : paragraphFallback.slice(1, 4),
    focus: getMultiSelect(properties[propertyNames.focus]),
    tags: getMultiSelect(properties[propertyNames.tags]),
    blocks,
    sourceUrl: page.url
  };
}, "pageToUpdate");
var withUniqueSlugs = /* @__PURE__ */ __name2((updates) => {
  const seen = /* @__PURE__ */ new Map();
  return updates.map((update) => {
    const baseSlug = update.slug || update.id.replace(/-/g, "").slice(-8);
    const count = seen.get(baseSlug) || 0;
    seen.set(baseSlug, count + 1);
    if (!count) return { ...update, slug: baseSlug };
    return {
      ...update,
      slug: `${baseSlug}-${update.id.replace(/-/g, "").slice(-6)}`
    };
  });
}, "withUniqueSlugs");
var fetchLearningUpdates = /* @__PURE__ */ __name2(async (env) => {
  loadPropertyNames(env);
  const dataSourceId = await getDataSourceId(env);
  const pages = await queryPages(env, dataSourceId);
  const updates = await Promise.all(pages.results.map((page) => pageToUpdate(env, page)));
  return withUniqueSlugs(updates);
}, "fetchLearningUpdates");
var cacheKey = "learning-updates:v1";
var defaultCacheTtl = 300;
var json = /* @__PURE__ */ __name2((body, init = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: {
    "Content-Type": "application/json",
    ...init.headers
  }
}), "json");
var getCachedUpdates = /* @__PURE__ */ __name2(async (env) => {
  if (!env.CONTENT_CACHE) return null;
  return env.CONTENT_CACHE.get(cacheKey, "json");
}, "getCachedUpdates");
var putCachedUpdates = /* @__PURE__ */ __name2(async (env, payload) => {
  if (!env.CONTENT_CACHE) return;
  await env.CONTENT_CACHE.put(cacheKey, JSON.stringify(payload), {
    expirationTtl: Number(env.CONTENT_CACHE_TTL_SECONDS || defaultCacheTtl)
  });
}, "putCachedUpdates");
var onRequestGet = /* @__PURE__ */ __name2(async ({ request, env }) => {
  const url = new URL(request.url);
  const shouldRefresh = url.searchParams.get("refresh") === "1";
  if (!shouldRefresh) {
    const cached = await getCachedUpdates(env);
    if (cached) {
      return json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60",
          "X-Content-Source": "kv"
        }
      });
    }
  }
  try {
    const payload = {
      updates: await fetchLearningUpdates(env),
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await putCachedUpdates(env, payload);
    return json(payload, {
      headers: {
        "Cache-Control": "public, max-age=60",
        "X-Content-Source": "notion"
      }
    });
  } catch (error) {
    const cached = await getCachedUpdates(env);
    if (cached) {
      return json(
        {
          ...cached,
          stale: true,
          error: error.message
        },
        {
          headers: {
            "Cache-Control": "public, max-age=30",
            "X-Content-Source": "kv-stale"
          }
        }
      );
    }
    return json(
      {
        error: error.message,
        updates: []
      },
      { status: 500 }
    );
  }
}, "onRequestGet");
var routes = [
  {
    routePath: "/api/updates",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-L3xhHz/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-L3xhHz/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.08868910152539722.js.map
