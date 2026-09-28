async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.SERVICE_REQUEST_TIMEOUT_MS || 3000),
  );
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { message: text };
    }
    if (!response.ok) {
      const error = new Error(
        body?.message || `Service request failed with ${response.status}`,
      );
      error.status = response.status;
      error.code = body?.code || "UPSTREAM_ERROR";
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

function internalHeaders() {
  return {
    "x-internal-service-token": process.env.INTERNAL_SERVICE_TOKEN || "",
  };
}

module.exports = { requestJson, internalHeaders };
