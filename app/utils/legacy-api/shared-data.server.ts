import { AccountSchema, TeamSchema } from '@haus23/tipprunde-model';
import * as v from 'valibot';

import { getResource } from './common';

export async function getLegacyUsers() {
  return await getResource(v.array(AccountSchema), '/api/v1/accounts');
}

export async function getLegacyTeams() {
  return await getResource(v.array(TeamSchema), '/api/v1/teams');
}
