import type { APIContext, APIRoute } from 'astro';

export const GET = async ({ locals }: APIContext, key: string) => {
  const { env } = locals.runtime;

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key is required' }), {
      status: 400,
    });
  }

  const object = await env.FLANS.get(key);

  if (object === null) {
    return new Response(JSON.stringify({ error: 'Object not found' }), {
      status: 404,
    });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers,
  });
};

export const PUT = async ({ request, locals }: APIContext, key: string) => {
  const { env } = locals.runtime;

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key is required' }), {
      status: 400,
    });
  }
  await env.FLANS.put(key, request.body);

  return new Response(JSON.stringify({ message: 'PUT successfully!' }), {
    status: 200,
  });
};

export const DELETE = async ({ locals }: APIContext, key: string) => {
  const { env } = locals.runtime;

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key is required' }), {
      status: 400,
    });
  }

  const object = await env.FLANS.delete(key);

  if (object === null) {
    return new Response(JSON.stringify({ error: 'Object not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: 'Deleted!' }), {
    status: 200,
  });
};
