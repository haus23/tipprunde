export async function loader() {
  throw new Response('Not found', { status: 404 });
}