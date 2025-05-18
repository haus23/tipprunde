import { AccountSchema } from '@haus23/tipprunde-model';
import * as v from 'valibot';

import { getResource } from './common';

export async function getUsers() {
  return await getResource(v.array(AccountSchema), '/api/v1/accounts');
}
