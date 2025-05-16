import type { Toast } from '~/utils/toast';

import { data, redirect } from 'react-router';

import { combineHeaders } from '~/utils/misc';
import { commitAppSession, getAppSession } from '~/utils/sessions.server';

export async function getToast(request: Request) {
  const session = await getAppSession(request);
  const toast = session.get('toast');

  return {
    toast,
    headers: toast
      ? new Headers({
          'Set-Cookie': await commitAppSession(session),
        })
      : null,
  };
}

async function createToastHeaders(request: Request, toast: Toast) {
  const session = await getAppSession(request);
  session.flash('toast', toast);
  const cookie = await commitAppSession(session);
  return new Headers({ 'Set-Cookie': cookie });
}

export async function redirectWithToast(
  request: Request,
  url: string,
  toast: Toast,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(
      init?.headers,
      await createToastHeaders(request, toast),
    ),
  });
}

export async function dataWithToast(
  request: Request,
  payload: unknown,
  toast: Toast,
  init?: ResponseInit,
) {
  return data(payload, {
    ...init,
    headers: combineHeaders(
      init?.headers,
      await createToastHeaders(request, toast),
    ),
  });
}
