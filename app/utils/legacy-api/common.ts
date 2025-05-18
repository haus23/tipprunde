import type { StandardSchemaV1 } from '@standard-schema/spec';

import { env } from '~/utils/env.server';

export async function getResource<T extends StandardSchemaV1>(
  schema: T,
  path: string,
): Promise<StandardSchemaV1.InferOutput<T>> {
  const resources = await fetch(`${env.UNTERBAU_URL}${path}`);
  const data = await resources.json();

  let result = schema['~standard'].validate(data);
  if (result instanceof Promise) result = await result;

  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2));
  }

  return result.value;
}
