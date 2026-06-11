import {
  leagues,
  matches as matchesTable,
  rounds as roundsTable,
  teams,
} from "@tipprunde/db/schema";
import { Button, Label } from "@tipprunde/ui";
import { desc, eq, max } from "drizzle-orm";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Button as RACButton,
  ComboBox,
  Form,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { redirect, useFetcher, useNavigate } from "react-router";

import { db } from "#/lib/db.server.ts";
import { cn, formatDate } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { DateField } from "../../components/date-field";
import { LigaDialog } from "../../components/liga-dialog";
import { RoundNavigator } from "../../components/round-navigator";
import { TeamDialog } from "../../components/team-dialog";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/spiele";

export const handle = { title: "Spiele" };

// --- Types ---

type Team = typeof teams.$inferSelect;
type League = typeof leagues.$inferSelect;

type MatchRow = {
  id: number;
  nr: number;
  date: string | null;
  hometeamId: string | null;
  awayteamId: string | null;
  leagueId: string | null;
  hometeam: Team | null;
  awayteam: Team | null;
  league: League | null;
};

// --- Loader ---

export async function loader({ params, context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const rounds = await db.query.rounds.findMany({
    where: { championshipId: championship.id },
    columns: { id: true, nr: true },
    orderBy: { nr: "asc" },
  });

  const lastRound = rounds.at(-1);
  if (!lastRound) {
    return {
      currentNr: null,
      championshipName: championship.name,
    };
  }

  const requestedNr = params.nr ? Number(params.nr) : null;
  const currentNr = requestedNr ?? lastRound.nr;

  if (!rounds.some((r) => r.nr === currentNr)) {
    throw redirect(`/${championship.slug}/spiele/${lastRound.nr}`);
  }

  const currentRoundId = rounds.find((r) => r.nr === currentNr)!.id;

  const [matchList, teamList, leagueList, lastMatchResult] = await Promise.all([
    db.query.matches.findMany({
      where: { roundId: currentRoundId },
      columns: {
        id: true,
        nr: true,
        date: true,
        hometeamId: true,
        awayteamId: true,
        leagueId: true,
      },
      with: {
        hometeam: true,
        awayteam: true,
        league: true,
      },
      orderBy: { nr: "asc" },
    }),
    db.query.teams.findMany({
      orderBy: { name: "asc" },
    }),
    db.query.leagues.findMany({
      orderBy: { name: "asc" },
    }),
    db
      .select({ date: matchesTable.date })
      .from(matchesTable)
      .innerJoin(roundsTable, eq(roundsTable.id, matchesTable.roundId))
      .where(eq(roundsTable.championshipId, championship.id))
      .orderBy(desc(matchesTable.nr))
      .limit(1),
  ]);

  return {
    rounds,
    currentNr,
    currentRoundId,
    matches: matchList as MatchRow[],
    lastMatchDate: lastMatchResult[0]?.date ?? "",
    teams: teamList,
    leagues: leagueList,
    slug: championship.slug,
    championshipName: championship.name,
  };
}

// --- Action ---

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const intent = formData.get("intent");

  const date = (formData.get("date") as string) || null;
  const leagueId = (formData.get("leagueId") as string) || null;
  const hometeamId = (formData.get("hometeamId") as string) || null;
  const awayteamId = (formData.get("awayteamId") as string) || null;

  if (intent === "create-match") {
    const roundId = Number(formData.get("roundId"));
    const result = await db
      .select({ maxNr: max(matchesTable.nr) })
      .from(matchesTable)
      .innerJoin(roundsTable, eq(roundsTable.id, matchesTable.roundId))
      .where(eq(roundsTable.championshipId, championship.id));
    const nr = (result[0]?.maxNr ?? 0) + 1;
    await db.insert(matchesTable).values({ roundId, nr, date, leagueId, hometeamId, awayteamId });
    return null;
  }

  if (intent === "update-match") {
    const id = Number(formData.get("id"));
    await db
      .update(matchesTable)
      .set({ date, leagueId, hometeamId, awayteamId })
      .where(eq(matchesTable.id, id));
    return null;
  }

  return null;
}

// --- Match combobox helper ---

const listBoxItemClass = cn(
  "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
  "hover:bg-nav-active data-focused:bg-nav-active data-selected:bg-accent-subtle",
);

type MatchComboBoxProps = {
  name: string;
  label: string;
  options: Array<Team | League>;
  value: string | null;
  onChange: (id: string | null) => void;
  onCreate?: () => void;
  placeholder?: string;
};

function MatchComboBox({
  name,
  label,
  options,
  value,
  onChange,
  onCreate,
  placeholder,
}: MatchComboBoxProps) {
  return (
    <ComboBox
      name={name}
      value={value}
      onChange={(key) => onChange(key ? String(key) : null)}
      defaultFilter={(textValue, search) => {
        const shortName = options.find((o) => o.name === textValue)?.shortName;
        return [textValue, shortName]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());
      }}
      menuTrigger="focus"
      className="flex flex-col gap-1.5"
    >
      <Label>{label}</Label>
      <div className={cn("flex rounded-sm", "focus-within:ring-2 focus-within:ring-accent/60")}>
        <Input
          placeholder={placeholder}
          className={cn(
            "border-subtle bg-surface w-full border px-2.5 py-1.5 text-sm outline-none",
            onCreate ? "rounded-l-sm border-r-0" : "rounded-sm",
          )}
        />
        {onCreate && (
          <RACButton
            onPress={onCreate}
            aria-label="Neu anlegen"
            className={cn(
              "border-subtle bg-surface shrink-0 rounded-r-sm border px-2.5 transition-colors outline-none",
              "hover:bg-nav-active",
            )}
          >
            <PlusIcon className="size-4" />
          </RACButton>
        )}
      </div>
      <Popover className="bg-surface-raised border-subtle w-(--trigger-width) rounded-sm border shadow-lg outline-none">
        <ListBox items={options} className="max-h-60 overflow-y-auto p-1 outline-none">
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name} className={listBoxItemClass}>
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

// --- Match form ---

type MatchFormProps = {
  roundId: number;
  editMatch: MatchRow | null;
  defaultDate: string;
  teams: Team[];
  leagues: League[];
  onDone: () => void;
};

type CreateDialog = "hometeam" | "awayteam" | "league" | null;

function MatchForm({ roundId, editMatch, defaultDate, teams, leagues, onDone }: MatchFormProps) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";
  const isEdit = !!editMatch;

  const [hometeamId, setHometeamId] = useState<string | null>(editMatch?.hometeamId ?? null);
  const [awayteamId, setAwayteamId] = useState<string | null>(editMatch?.awayteamId ?? null);
  const [leagueId, setLeagueId] = useState<string | null>(editMatch?.leagueId ?? null);
  const [createDialog, setCreateDialog] = useState<CreateDialog>(null);

  if (fetcher.state === "idle" && fetcher.data !== undefined) {
    onDone();
  }

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          void fetcher.submit(e.currentTarget, { method: "post" });
        }}
        className="space-y-4"
      >
        {isEdit && <input type="hidden" name="id" value={editMatch.id} />}
        <input type="hidden" name="intent" value={isEdit ? "update-match" : "create-match"} />
        <input type="hidden" name="roundId" value={roundId} />

        <div className="grid grid-cols-4 gap-4">
          <DateField name="date" label="Datum" defaultValue={editMatch?.date ?? defaultDate} />

          <MatchComboBox
            name="leagueId"
            label="Liga"
            placeholder="Liga wählen ..."
            options={leagues}
            value={leagueId}
            onChange={setLeagueId}
            onCreate={() => setCreateDialog("league")}
          />

          <MatchComboBox
            name="hometeamId"
            label="Heimteam"
            placeholder="Team wählen ..."
            options={teams}
            value={hometeamId}
            onChange={setHometeamId}
            onCreate={() => setCreateDialog("hometeam")}
          />

          <MatchComboBox
            name="awayteamId"
            label="Auswärtsteam"
            placeholder="Team wählen ..."
            options={teams}
            value={awayteamId}
            onChange={setAwayteamId}
            onCreate={() => setCreateDialog("awayteam")}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button intent="secondary" type="button" onPress={onDone} excludeFromTabOrder>
            Abbrechen
          </Button>
          <Button type="submit" isDisabled={isPending}>
            {isPending ? "…" : isEdit ? "Speichern" : "Anlegen"}
          </Button>
        </div>
      </Form>

      <TeamDialog
        isOpen={createDialog === "hometeam" || createDialog === "awayteam"}
        onOpenChange={(open) => !open && setCreateDialog(null)}
        onSuccess={(team) => {
          if (createDialog === "hometeam") setHometeamId(team.id);
          else setAwayteamId(team.id);
          setCreateDialog(null);
        }}
      />

      <LigaDialog
        isOpen={createDialog === "league"}
        onOpenChange={(open) => !open && setCreateDialog(null)}
        onSuccess={(league) => {
          setLeagueId(league.id);
          setCreateDialog(null);
        }}
      />
    </>
  );
}

// --- Matches table ---

function MatchesTable({ matches, onEdit }: { matches: MatchRow[]; onEdit: (m: MatchRow) => void }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-subtle border-b">
          <th className="text-muted pr-4 pb-3 text-right font-medium">#</th>
          <th className="text-muted pr-4 pb-3 text-left font-medium">Datum</th>
          <th className="text-muted pr-4 pb-3 text-left font-medium">Spiel</th>
          <th className="text-muted pb-3 text-left font-medium">Liga</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.id} className="border-subtle border-b last:border-0">
            <td className="text-muted py-3 pr-4 text-right tabular-nums">{match.nr}</td>
            <td className="py-3 pr-4 tabular-nums">{match.date ? formatDate(match.date) : "—"}</td>
            <td className="py-3 pr-4">
              {match.hometeam?.name ?? "?"} – {match.awayteam?.name ?? "?"}
            </td>
            <td className="py-3">{match.league?.shortName ?? "—"}</td>
            <td className="py-3 text-right">
              <Button
                intent="ghost"
                size="icon"
                onPress={() => onEdit(match)}
                aria-label={`Spiel ${match.nr} bearbeiten`}
              >
                <PencilIcon className="size-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Page ---

export default function Spiele({ loaderData }: Route.ComponentProps) {
  const {
    rounds,
    currentNr,
    currentRoundId,
    matches,
    lastMatchDate,
    teams,
    leagues,
    slug,
    championshipName,
  } = loaderData;

  const navigate = useNavigate();
  const [editMatch, setEditMatch] = useState<MatchRow | null>(null);
  const [createKey, setCreateKey] = useState(0);

  const formKey = editMatch ? `edit-${editMatch.id}` : `create-${createKey}`;

  const handleDone = useCallback(() => {
    setEditMatch(null);
    setCreateKey((k) => k + 1);
  }, []);

  if (currentNr === null) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Spiele | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Runden angelegt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <title>{`Spiele | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center">
        <RoundNavigator
          currentNr={currentNr}
          totalRounds={rounds.length}
          onNavigate={(nr) => void navigate(`/${slug}/spiele/${nr}`)}
        />
      </div>

      <Card>
        <div className="border-subtle border-b px-6 py-4">
          <h2 className="text-sm font-semibold">
            {editMatch ? "Spiel bearbeiten" : "Neues Spiel"}
          </h2>
        </div>
        <CardContent>
          <MatchForm
            key={formKey}
            roundId={currentRoundId!}
            editMatch={editMatch}
            defaultDate={lastMatchDate}
            teams={teams}
            leagues={leagues}
            onDone={handleDone}
          />
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <Card>
          <div className="border-subtle border-b px-6 py-4">
            <h2 className="text-sm font-semibold">Spiele</h2>
          </div>
          <CardContent>
            <MatchesTable matches={matches} onEdit={setEditMatch} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
