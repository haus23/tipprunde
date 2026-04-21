import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CompositeComponent, createCompositeComponent } from "@tanstack/react-start/rsc";

import { requireManager } from "#/app/(auth)/guards.ts";
import {
  fetchChampionshipsFn,
  fetchCurrentChampionshipFn,
} from "#/app/manager/championships.ts";

const getManagerLayout = createServerFn()
  .inputValidator((data: { slug: string | undefined }) => data)
  .handler(async ({ data: { slug } }) => {
    const [championship, championships] = await Promise.all([
      fetchCurrentChampionshipFn({ data: slug }),
      fetchChampionshipsFn(),
    ]);

    const src = await createCompositeComponent(
      (props: {
        Nav: React.ComponentType<{
          name: string;
          slug: string | undefined;
          championships: { slug: string; name: string }[];
        }>;
        children?: React.ReactNode;
      }) => (
        <div>
          <h2>Server-rendered Manager Layout</h2>
          <props.Nav
            name={championship?.name ?? ""}
            slug={slug}
            championships={championships}
          />
          <div>{props.children}</div>
        </div>
      ),
    );

    return { src };
  });

export const Route = createFileRoute("/manager")({
  beforeLoad: async ({ matches }): Promise<{ slug: string | undefined }> => {
    await requireManager();

    const params = matches.at(-1)?.params;
    const slug = params && "slug" in params ? params.slug : undefined;

    return { slug };
  },
  loader: async ({ context: { slug } }) => ({
    Layout: await getManagerLayout({ data: { slug } }),
  }),
  component: RouteComponent,
});

function ManagerNav({
  name,
  slug,
  championships,
}: {
  name: string;
  slug: string | undefined;
  championships: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const navigate = useNavigate();

  const switchChampionship = async (targetSlug: string) => {
    router.invalidate();
    await navigate({ to: "/manager/{-$slug}", params: { slug: targetSlug } });
  };

  return (
    <nav>
      <ul>
        <li>
          {championships.map((c) => (
            <button key={c.slug} onClick={() => switchChampionship(c.slug)}>
              {c.name}
            </button>
          ))}
        </li>
        <li>{name}</li>
        <li>
          <Link to="/manager/{-$slug}" params={slug ? { slug } : {}}>
            Turnier
          </Link>
        </li>
        <li>
          <Link to="/manager/{-$slug}/spiele" params={slug ? { slug } : {}}>
            Spiele
          </Link>
        </li>
        <li>
          <Link to="/manager/stammdaten/turniere">Stammdaten Turniere</Link>
        </li>
      </ul>
    </nav>
  );
}

function RouteComponent() {
  const { Layout } = Route.useLoaderData();
  return (
    <CompositeComponent src={Layout.src} Nav={ManagerNav}>
      <Outlet />
    </CompositeComponent>
  );
}
