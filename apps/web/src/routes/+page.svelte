<script lang="ts">
    import { RULE_CATEGORIES } from "$lib/domain/rules";
    import { cn, formatDate } from "$lib/utils";
    import { userStore } from "$lib/state/user.svelte";
    import Card from "$ui/card.svelte";
    import { slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const championship = $derived(data.championship);

    const top3 = $derived(data.ranking.slice(0, 3));
    const userEntry = $derived(
        userStore.id
            ? (data.ranking.find((e) => e.userId === userStore.id) ?? null)
            : null,
    );
    const userBelowTop3 = $derived(
        userEntry && !top3.some((e) => e.userId === userEntry.userId)
            ? userEntry
            : null,
    );
    const userRankingIndex = $derived(
        userBelowTop3 ? data.ranking.indexOf(userBelowTop3) : -1,
    );

    const championshipRules = RULE_CATEGORIES.flatMap(
        ({ field, label, rules }) => {
            const ruleId = data.championship.ruleset?.[field];
            if (!ruleId || ruleId === "keine-besonderheiten") return [];
            const rule = rules.find((r) => r.value === ruleId);
            return rule ? [{ label, description: rule.description }] : [];
        },
    );
</script>

<svelte:head>
    <title>runde.tips</title>
</svelte:head>

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
                    {#each top3 as entry, index}
                        <tr class="border-input border-b last:border-b-0">
                            <td class="w-px py-2 pr-3 text-right tabular-nums">
                                {entry.rank !== top3[index - 1]?.rank
                                    ? entry.rank
                                    : ""}
                            </td>
                            <td class="py-2">
                                <a
                                    href={`/spieler/${entry.slug}`}
                                    class={cn(
                                        "rounded outline-none",
                                        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
                                        userStore.id === entry.userId &&
                                            "text-accent",
                                    )}
                                >
                                    {entry.name}
                                </a>
                            </td>
                            <td class="py-2 text-right font-medium tabular-nums"
                                >{entry.points}</td
                            >
                        </tr>
                    {/each}
                </tbody>
                {#if userBelowTop3}
                    <tbody>
                        <tr>
                            <td colSpan={3} class="p-0">
                                <div
                                    transition:slide={{
                                        duration: 250,
                                        easing: cubicOut,
                                    }}
                                >
                                    {#if userRankingIndex > 3}
                                        <p
                                            class="text-subtle py-2.5 text-center text-xs"
                                        >
                                            ⋮
                                        </p>
                                    {/if}
                                    <div
                                        class="border-input flex items-center gap-3 border-t py-2"
                                    >
                                        <span
                                            class="w-4 shrink-0 text-right tabular-nums"
                                            >{userBelowTop3.rank}</span
                                        >
                                        <a
                                            href={`/spieler/${userBelowTop3.slug}`}
                                            class="text-accent focus-visible:ring-focus flex-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                                        >
                                            {userBelowTop3.name}
                                        </a>
                                        <span class="font-medium tabular-nums"
                                            >{userBelowTop3.points}</span
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                {/if}
            </table>
            <div class="mt-auto pt-3 flex items-center justify-end gap-4">
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
                                    href={`/spiele/${match.nr}`}
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
            <div class="mt-auto pt-3 flex items-center justify-end gap-4">
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
