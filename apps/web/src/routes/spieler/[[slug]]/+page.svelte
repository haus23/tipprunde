<script lang="ts">
    import { Accordion } from "bits-ui";
    import { ChevronDownIcon } from "@lucide/svelte";

    import SpielerSelect from "$ui/spieler-select.svelte";
    import TippFlag from "$ui/tipp-flag.svelte";
    import { cn, formatDate } from "$lib/utils";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const championship = $derived(data.championship);
    const player = $derived(data.player);
    const rounds = $derived(data.rounds);
    const stats = $derived(data.stats);

    const itemClass = cn(
        "group bg-surface border-surface border-y",
        "xs:mx-4 xs:rounded-md xs:border",
        "transition-[margin] duration-300 ease-out",
        "data-[state=open]:my-2 first:data-[state=open]:mt-0 last:data-[state=open]:mb-0",
    );

    const triggerClass = cn(
        "flex w-full cursor-pointer select-none items-center justify-between",
        "px-2 py-3 xs:px-4 xs:rounded-md",
        "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus",
    );

    const contentClass = cn(
        "overflow-hidden border-t border-input",
        "px-2 py-2 xs:px-4",
        "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
    );

    const thClass = cn("text-subtle pt-2 pb-3 text-xs font-medium tracking-wide uppercase");

    const tdClass = cn("w-px py-3 px-1 xs:px-2 tabular-nums");

    const matchLinkClass = cn(
        "rounded outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
    );
</script>

<svelte:head>
    <title>{player.name} · {championship.name}</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <SpielerSelect players={data.ranking} currentSlug={player.slug ?? ""} />
        <div
            class="text-subtle flex flex-col items-center gap-x-1.5 text-sm leading-relaxed xs:flex-row"
        >
            <span>{championship.name} · Platz {player.rank} · {player.points} Punkte</span>
            <span class="xs:before:content-['_·_']">
                {stats.playerSpiele} Spiele{stats.playerAvg !== null
                    ? ` · Ø ${stats.playerAvg}`
                    : ""}
            </span>
        </div>
    </div>

    {#if rounds.length === 0}
        <p class="text-subtle px-4 text-sm">Noch keine Runden gespielt.</p>
    {:else}
        <Accordion.Root type="single" value={String(stats.defaultOpenRound)} class="flex flex-col gap-0.5">
            {#each rounds as round (round.nr)}
                {@const roundMatchesWithResult = round.matches.filter((m) => m.result !== null).length}
                {@const roundTotalMatches = round.matches.length}
                {@const roundPoints = round.matches.reduce((s, m) => s + (m.tips[0]?.points ?? 0), 0)}
                {@const roundAvg =
                    round.tipsPublished && roundMatchesWithResult > 0
                        ? (roundPoints / roundMatchesWithResult).toFixed(2)
                        : null}
                {@const roundSpiele =
                    roundMatchesWithResult === roundTotalMatches
                        ? `${roundTotalMatches}`
                        : `${roundMatchesWithResult}/${roundTotalMatches}`}

                <Accordion.Item value={String(round.nr)} class={itemClass}>
                    <Accordion.Trigger class={triggerClass}>
                        <span class="text-sm font-medium">Runde {round.nr}</span>
                        <span class="flex items-center gap-3">
                            <span class="text-subtle flex items-center gap-2 text-xs">
                                {#if round.tipsPublished}
                                    <span>{roundPoints} Pkt</span>
                                {/if}
                                <span>{roundSpiele} Sp.</span>
                                {#if roundAvg !== null}
                                    <span>Ø {roundAvg}</span>
                                {/if}
                            </span>
                            <ChevronDownIcon
                                size={14}
                                class="text-subtle transition-transform duration-200 group-data-[state=open]:rotate-180"
                            />
                        </span>
                    </Accordion.Trigger>
                    <Accordion.Content class={contentClass}>
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-input border-b text-left">
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-right")}>#</th>
                                    <th class={cn(thClass, "hidden w-px px-2 md:table-cell")}>Datum</th>
                                    <th class={cn(thClass, "px-1 xs:px-2")}>Paarung</th>
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-center")}>Erg.</th>
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-center")}>Tipp</th>
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-center")}>Pkt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each round.matches as match (match.nr)}
                                    {@const tip = match.tips[0]}
                                    {@const showTip = round.tipsPublished && tip?.tip}
                                    <tr class="border-input border-b last:border-b-0">
                                        <td class={cn(tdClass, "text-right")}>
                                            <a
                                                href="/spiele/{match.nr}"
                                                class={cn(matchLinkClass, "text-subtle hover:text-base transition-colors")}
                                            >
                                                {match.nr}
                                            </a>
                                        </td>
                                        <td class="hidden w-px px-2 py-3 tabular-nums md:table-cell">
                                            {match.date ? formatDate(match.date) : "–"}
                                        </td>
                                        <td class="px-1 py-3 xs:px-2">
                                            <a href="/spiele/{match.nr}" class={matchLinkClass}>
                                                <span class="hidden sm:inline">
                                                    {match.hometeam?.name ?? "–"} – {match.awayteam?.name ?? "–"}
                                                </span>
                                                <span class="sm:hidden">
                                                    {match.hometeam?.shortName ?? "–"} – {match.awayteam?.shortName ?? "–"}
                                                </span>
                                            </a>
                                        </td>
                                        <td class={cn(tdClass, "text-center")}>{match.result ?? "–:–"}</td>
                                        <td class={cn(tdClass, "relative px-3 xs:px-6 text-center")}>
                                            {showTip ? tip!.tip : "–"}
                                            {#if showTip && tip!.joker}
                                                <TippFlag />
                                            {/if}
                                        </td>
                                        <td class={cn(tdClass, "text-center")}>
                                            {tip?.points != null ? tip.points : "–"}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </Accordion.Content>
                </Accordion.Item>
            {/each}
        </Accordion.Root>
    {/if}
</div>
