import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCodeValue: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  let responseStatusCode = responseStatusCodeValue;
  let shellRendered = false;
  const userAgent = request.headers.get('user-agent');

  const body = await renderToReadableStream(
    <ServerRouter
      context={routerContext}
      url={request.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );
  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
