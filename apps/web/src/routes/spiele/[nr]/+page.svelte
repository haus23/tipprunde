<script lang="ts">
    import {
        ArrowDownIcon,
        ArrowUpDownIcon,
        ArrowUpIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
    } from "@lucide/svelte";

    import SpieleSelect from "$ui/spiele-select.svelte";
    import TippFlag from "$ui/tipp-flag.svelte";
    import { cn, formatDate } from "$lib/utils";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
    const matchData = $derived(data.matchData);

    type SortCol = "name" | "tip" | "points";
    type SortDir = "asc" | "desc";

    let sortCol = $state<SortCol | null>(null);
    let sortDir = $state<SortDir>("asc");

    function handleSort(col: SortCol) {
        if (sortCol !== col) {
            sortCol = col;
            sortDir = "asc";
        } else if (sortDir === "asc") {
            sortDir = "desc";
        } else {
            sortCol = null;
        }
    }

    function parseTip(tip: string): [number, number] {
        const [h, a] = tip.split(":").map(Number);
        return [isNaN(h!) ? 99 : h!, isNaN(a!) ? 99 : a!];
    }

    const sortedTips = $derived.by(() => {
        const tips = matchData.rankedTips;
        if (!sortCol) return tips;
        const factor = sortDir === "asc" ? 1 : -1;
        return [...tips].sort((a, b) => {
            if (sortCol === "name")
                return factor * a.name.localeCompare(b.name, "de");
            if (sortCol === "points") {
                if (a.points === null && b.points === null) return 0;
                if (a.points === null) return 1;
                if (b.points === null) return -1;
                return factor * (a.points - b.points);
            }
            if (a.tip === null && b.tip === null) return 0;
            if (a.tip === null) return 1;
            if (b.tip === null) return -1;
            const [ah, aa] = parseTip(a.tip);
            const [bh, ba] = parseTip(b.tip);
            const aDiff = ah - aa;
            const bDiff = bh - ba;
            return factor * (bDiff - aDiff || bh - ah);
        });
    });

    const meta = $derived.by(() => {
        const parts: string[] = [];
        if (matchData.date) parts.push(formatDate(matchData.date));
        if (matchData.liga) parts.push(matchData.liga);
        if (matchData.result) parts.push(`Ergebnis ${matchData.result}`);
        if (matchData.totalPoints !== null)
            parts.push(`${matchData.totalPoints} Pkt`);
        return parts.join(" · ");
    });

    const allMatches = $derived(
        data.roundsWithMatches.flatMap((r) => r.matches),
    );
    const currentIndex = $derived(
        allMatches.findIndex((m) => m.nr === matchData.nr),
    );
    const prevNr = $derived(
        currentIndex > 0 ? (allMatches[currentIndex - 1]?.nr ?? null) : null,
    );
    const nextNr = $derived(
        currentIndex < allMatches.length - 1
            ? (allMatches[currentIndex + 1]?.nr ?? null)
            : null,
    );

    const paarung = $derived(
        allMatches[currentIndex]?.paarungShort ?? `Spiel ${matchData.nr}`,
    );

    const navLinkClass = cn(
        "flex items-center gap-1 rounded text-sm outline-none",
        "text-subtle hover:text-base transition-colors",
        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
    );

    const thClass = cn(
        "text-subtle pt-2 pb-3 text-xs font-medium tracking-wide uppercase",
    );
    const tdClass = cn("w-px py-3 px-2 tabular-nums");

    const sortBtnClass = cn(
        "flex items-center gap-1 rounded uppercase outline-none",
        "transition-transform active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
    );
</script>

<svelte:head>
    <title>{paarung} · {data.championship.name}</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 relative flex flex-col items-center gap-2 px-4 md:mb-6">
        <a
            href="/spiele"
            class={cn(navLinkClass, "self-start xs:self-auto mb-1 text-xs")}
        >
            <ChevronLeftIcon size={12} />
            Spielübersicht
        </a>
        <SpieleSelect
            rounds={data.roundsWithMatches}
            currentNr={matchData.nr}
        />
        {#if meta}
            <p class="text-subtle text-sm">{meta}</p>
        {/if}
        <div
            class="mt-2 mb-4 flex w-full justify-between
                   md:mt-0 md:mb-0 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2"
        >
            {#if prevNr !== null}
                <a href="/spiele/{prevNr}" class={cn(navLinkClass, "xs:ml-4")}>
                    <ChevronLeftIcon size={16} />
                    Vorheriges
                </a>
            {:else}
                <span></span>
            {/if}
            {#if nextNr !== null}
                <a href="/spiele/{nextNr}" class={cn(navLinkClass, "xs:mr-4")}>
                    Nächstes
                    <ChevronRightIcon size={16} />
                </a>
            {/if}
        </div>
    </div>

    <div
        class="bg-surface border-surface xs:mx-0 xs:rounded-md xs:border mx-0 border-y px-4 py-2"
    >
        <table class="w-full text-sm">
            <thead>
                <tr class="border-input border-b text-left">
                    <th class={thClass}>
                        <button
                            onclick={() => handleSort("name")}
                            class={sortBtnClass}
                        >
                            Spieler
                            {#if sortCol !== "name"}
                                <ArrowUpDownIcon
                                    size={12}
                                    class="text-subtle/50"
                                />
                            {:else if sortDir === "asc"}
                                <ArrowUpIcon size={12} class="text-subtle" />
                            {:else}
                                <ArrowDownIcon size={12} class="text-subtle" />
                            {/if}
                        </button>
                    </th>
                    {#if matchData.tipsPublished}
                        <th class={cn(thClass, "w-px text-center")}>
                            <button
                                onclick={() => handleSort("tip")}
                                class={cn(sortBtnClass, "mx-auto")}
                            >
                                Tipp
                                {#if sortCol !== "tip"}
                                    <ArrowUpDownIcon
                                        size={12}
                                        class="text-subtle/50"
                                    />
                                {:else if sortDir === "asc"}
                                    <ArrowUpIcon
                                        size={12}
                                        class="text-subtle"
                                    />
                                {:else}
                                    <ArrowDownIcon
                                        size={12}
                                        class="text-subtle"
                                    />
                                {/if}
                            </button>
                        </th>
                        <th class={cn(thClass, "w-px text-center")}>
                            <button
                                onclick={() => handleSort("points")}
                                class={cn(sortBtnClass, "mx-auto")}
                            >
                                Pkt
                                {#if sortCol !== "points"}
                                    <ArrowUpDownIcon
                                        size={12}
                                        class="text-subtle/50"
                                    />
                                {:else if sortDir === "asc"}
                                    <ArrowUpIcon
                                        size={12}
                                        class="text-subtle"
                                    />
                                {:else}
                                    <ArrowDownIcon
                                        size={12}
                                        class="text-subtle"
                                    />
                                {/if}
                            </button>
                        </th>
                    {/if}
                </tr>
            </thead>
            <tbody>
                {#each sortedTips as tip (tip.userId)}
                    <tr class="border-input border-b last:border-b-0">
                        <td class="py-3">
                            <a
                                href="/spieler/{tip.slug}"
                                class={cn(
                                    "rounded font-medium outline-none transition-colors",
                                    "hover:text-subtle",
                                    "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
                                )}
                            >
                                {tip.name}
                            </a>
                        </td>
                        {#if matchData.tipsPublished}
                            <td
                                class={cn(tdClass, "relative px-6 text-center")}
                            >
                                {tip.tip ?? "–"}
                                {#if tip.joker}
                                    <TippFlag />
                                {/if}
                            </td>
                            <td class={cn(tdClass, "text-center")}
                                >{tip.points ?? "–"}</td
                            >
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
