<script lang="ts">
    import { RULE_CATEGORIES } from "$lib/domain/rules";
    import { formatDate } from "$lib/utils";
    import Card from "$ui/card.svelte";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const championshipRules = RULE_CATEGORIES.flatMap(
        ({ field, label, rules }) => {
            const ruleId = data.championship.ruleset?.[field];
            if (!ruleId || ruleId === "keine-besonderheiten") return [];
            const rule = rules.find((r) => r.value === ruleId);
            return rule ? [{ label, description: rule.description }] : [];
        },
    );
</script>

<div class="mx-auto w-full max-w-5xl px-2 xs:px-4 py-8 flex flex-col gap-8">
    <div class="flex flex-col items-center">
        <p class="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 class="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p class="text-subtle mt-1 text-lg">{data.championship.name}</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
        <Card
            title={data.championship.completed
                ? "Abschlusstabelle"
                : "Aktuelle Tabelle"}
        >
            <table class="w-full text-sm">
                <tbody>
                    {#each data.ranking as entry, index}
                        <tr class="border-input border-b last:border-b-0">
                            <td class="w-px py-2 pr-3 text-right tabular-nums">
                                {entry.rank !== data.ranking[index - 1]?.rank
                                    ? entry.rank
                                    : ""}
                            </td>
                            <td class="py-2">
                                <a
                                    href={`/spieler?name=${entry.slug}`}
                                    class={`${data.user?.id === entry.userId ? "text-accent " : ""}focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface`}
                                >
                                    {entry.name}
                                </a>
                            </td>
                            <td class="py-2 text-right font-medium tabular-nums"
                                >{entry.points}</td
                            >
                        </tr>
                    {/each}
                    {#if data.userBelowTop3}
                        {#if data.userRankingIndex > 3}
                            <tr>
                                <td
                                    colSpan={3}
                                    class="text-subtle py-2.5 text-center text-xs"
                                >
                                    ⋮
                                </td>
                            </tr>
                        {/if}
                        <tr class="border-input border-t">
                            <td class="w-px py-2 pr-3 text-right tabular-nums">
                                {data.userBelowTop3.rank}
                            </td>
                            <td class="py-2">
                                <a
                                    href={`/spieler?name=${data.userBelowTop3.slug}`}
                                    class="text-accent focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                                >
                                    {data.userBelowTop3.name}
                                </a>
                            </td>
                            <td class="py-2 text-right font-medium tabular-nums"
                                >{data.userBelowTop3.points}</td
                            >
                        </tr>
                    {/if}
                </tbody>
            </table>
            <div class="mt-3 flex items-center justify-end gap-4">
                <a
                    href="/verlauf"
                    class="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface text-subtle hover:text-base text-xs transition-colors"
                    >Verlauf →</a
                >
                <a
                    href="/tabelle"
                    class="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface text-subtle hover:text-base text-xs transition-colors"
                    >Vollständige Tabelle →</a
                >
            </div>
        </Card>
        <Card
            title={data.championship.completed
                ? "Letzte Spiele"
                : "Aktuelle Spiele"}
        >
            <table class="w-full text-sm">
                <tbody>
                    {#each data.currentMatches as match}
                        <tr class="border-input border-b last:border-b-0">
                            <td
                                class="text-subtle w-px py-2 pr-3 text-xs whitespace-nowrap tabular-nums"
                            >
                                {formatDate(match.date!)}
                            </td>
                            <td class="py-2">
                                <a
                                    href={`/spiel?nr=${match.nr}`}
                                    class="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                                >
                                    <span class="hidden lg:inline">
                                        {match.hometeam?.name ?? "–"} – {match
                                            .awayteam?.name ?? "–"}
                                    </span>
                                    <span class="lg:hidden">
                                        {match.hometeam?.shortName ?? "–"} – {match
                                            .awayteam?.shortName ?? "–"}
                                    </span>
                                </a>
                            </td>
                            <td
                                class="text-subtle w-px py-2 pl-3 text-right whitespace-nowrap tabular-nums"
                            >
                                {match.result ?? "–:–"}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="mt-3 flex items-center justify-end gap-4">
                <a
                    href="/spiele"
                    class="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface text-subtle hover:text-base text-xs transition-colors"
                    >Komplette Übersicht →</a
                >
            </div>
        </Card>
        <div class="sm:col-span-2 sm:max-w-lg sm:mx-auto">
            <Card title="Regelwerk">
                <div class="flex flex-col gap-3">
                    <p class="text-subtle text-sm">
                        {data.championship.ruleset?.description}
                    </p>
                    {#each championshipRules as rule}
                        <div>
                            <p class="text-sm font-medium">{rule.label}</p>
                            <p class="text-subtle text-sm">
                                {rule.description}
                            </p>
                        </div>
                    {/each}
                </div>
            </Card>
        </div>
    </div>
</div>
