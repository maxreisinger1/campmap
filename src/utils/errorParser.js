export async function parseError(error) {
  let msg = error.message;

  // Supabase FunctionsHttpError exposes body in context
  const body = error.context?.body;

  // Case: body is a ReadableStream
  if (body instanceof ReadableStream) {
    const reader = body.getReader();
    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(new TextDecoder().decode(result.value));
    }
    const bodyText = chunks.join("");
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed?.error) msg = parsed.error;
      else msg = bodyText;
    } catch {
      msg = bodyText;
    }
  }

  // Case: body is just string
  else if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      if (parsed?.error) msg = parsed.error;
      else msg = body;
    } catch {
      msg = body;
    }
  }

  return msg || "Unknown error occurred";
}
