import { redirect } from 'react-router';

export async function getPublishedChampionships() {
  return [];
}

export async function requireChampionship(championshipSlug?: string) {
  throw redirect('/willkommen');
}
