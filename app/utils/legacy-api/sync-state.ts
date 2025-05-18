import app from '~/app';

export async function syncState() {
  const { kvLegacySync } = app;

  const value = await kvLegacySync.get('users');
  console.log(value);
}
