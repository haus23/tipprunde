import { Button, cx } from "@tipprunde/ui";
import { LaptopIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { redirect, useFetcher } from "react-router";

import { logAuthEvent } from "#/lib/auth-events.server.ts";
import { userContext } from "#/lib/context.ts";
import { db } from "#/lib/db.server.ts";
import {
  deleteUserSession,
  getSessionFromRequest,
  getUserSessions,
  revokeUserSessions,
} from "#/lib/session.server.ts";
import { describeUserAgent, parseUserAgent, type DeviceKind } from "#/lib/user-agent.ts";
import { formatDateTime } from "#/lib/utils.ts";

import type { Route } from "./+types/konto";

/**
 * The logged-in player's own account: who they are, and every device they
 * are logged in on, with a way to end the ones they do not recognise.
 * Read-only account data for now; changing the email address would go here.
 * See docs/decisions/15-player-self-service.md, feature 3.
 */
export async function loader({ request, context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  if (!user) throw redirect("/login?redirectTo=/konto");

  const session = await getSessionFromRequest(request);
  const [account, sessionRows] = await Promise.all([
    db.query.users.findFirst({ where: { id: user.id }, columns: { name: true, email: true } }),
    getUserSessions(user.id, session.get("sessionId")),
  ]);

  return {
    account: { name: account?.name ?? user.name, email: account?.email ?? null },
    // Parsed here, not in the browser: the raw header never leaves the server.
    sessions: sessionRows.map(({ userAgent, ...s }) => {
      const parsed = parseUserAgent(userAgent);
      return { ...s, device: describeUserAgent(parsed), kind: parsed.kind };
    }),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const user = context.get(userContext);
  if (!user) throw redirect("/login?redirectTo=/konto");

  const formData = await request.formData();
  const intent = formData.get("intent");
  const session = await getSessionFromRequest(request);
  const currentId = session.get("sessionId");

  let count = 0;
  if (intent === "end-session") {
    const key = formData.get("key");
    if (typeof key === "string" && (await deleteUserSession(user.id, key, currentId))) count = 1;
  } else if (intent === "end-other-sessions" && currentId) {
    count = await revokeUserSessions(user.id, currentId);
  }

  // Same audit trail as the admin's "Sitzungen beenden" in the manager.
  if (count > 0) {
    const account = await db.query.users.findFirst({
      where: { id: user.id },
      columns: { email: true },
    });
    await logAuthEvent({
      type: "sessions_revoked",
      userId: user.id,
      email: account?.email ?? null,
      detail: count === 1 ? "Selbst beendet (1 Gerät)" : `Selbst beendet (${count} Geräte)`,
    });
  }
  // 200 either way, so the list reloads — a session already gone simply
  // disappears from it.
  return { count };
}

const KIND_ICON: Record<DeviceKind, typeof LaptopIcon> = {
  phone: SmartphoneIcon,
  tablet: TabletIcon,
  computer: LaptopIcon,
};

type SessionItem = Route.ComponentProps["loaderData"]["sessions"][number];

function SessionRow({ session }: { session: SessionItem }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";
  const Icon = KIND_ICON[session.kind];

  return (
    <li className={cx("flex items-center gap-3 py-3", isPending && "opacity-50")}>
      <Icon aria-hidden className="text-muted size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-base">
          <span>{session.device}</span>
          {session.isCurrent && (
            <span className="text-accent text-xs font-medium tracking-wide uppercase">
              Dieses Gerät
            </span>
          )}
        </div>
        <div className="text-subtle text-sm">
          Angemeldet {formatDateTime(session.createdAt)}
          {session.rememberMe && " · angemeldet bleiben"}
        </div>
      </div>
      {/* The current session ends with "Abmelden" in the menu, not here. */}
      {!session.isCurrent && (
        <Button
          intent="secondary"
          size="sm"
          isDisabled={isPending}
          onPress={() =>
            void fetcher.submit({ intent: "end-session", key: session.key }, { method: "post" })
          }
        >
          Abmelden
        </Button>
      )}
    </li>
  );
}

export default function Konto({ loaderData }: Route.ComponentProps) {
  const { account, sessions } = loaderData;
  const othersFetcher = useFetcher();
  const otherCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="xs:px-6 mx-auto w-full max-w-2xl px-4 py-8">
      <title>Mein Konto · runde.tips</title>
      <h1 className="poster-title mb-8 text-3xl">Mein Konto</h1>

      <section aria-labelledby="konto-daten" className="mb-10">
        <h2 id="konto-daten" className="text-muted mb-3 text-xs tracking-wide uppercase">
          Konto
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-base">
          <dt className="text-subtle">Name</dt>
          <dd>{account.name}</dd>
          <dt className="text-subtle">E-Mail</dt>
          <dd className="break-all">{account.email ?? "–"}</dd>
        </dl>
      </section>

      <section aria-labelledby="konto-geraete">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="konto-geraete" className="text-muted text-xs tracking-wide uppercase">
            Angemeldete Geräte
          </h2>
          {/* A single other device has its own button right in the list. */}
          {otherCount >= 2 && (
            <Button
              intent="ghost"
              size="sm"
              isDisabled={othersFetcher.state !== "idle"}
              onPress={() =>
                void othersFetcher.submit({ intent: "end-other-sessions" }, { method: "post" })
              }
            >
              Alle anderen Geräte abmelden
            </Button>
          )}
        </div>
        <ul className="divide-subtle divide-y">
          {sessions.map((s) => (
            <SessionRow key={s.key} session={s} />
          ))}
        </ul>
      </section>
    </div>
  );
}
