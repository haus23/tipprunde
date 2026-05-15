<script lang="ts">
    import { Accordion } from "bits-ui";
    import { ChevronDownIcon } from "@lucide/svelte";

    import { cn, formatDate } from "$lib/utils";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const championship = $derived(data.championship);
    const rounds = $derived(data.roundsData);

    const itemClass = cn(
        "group bg-surface border-surface border-y",
        "xs:rounded-md xs:border",
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

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 class="text-2xl font-semibold tracking-tight">Spielübersicht</h1>
        <p class="text-subtle text-sm">{championship.name}</p>
    </div>

    {#if rounds.length === 0}
        <p class="text-subtle px-4 text-sm">Noch keine Runden gespielt.</p>
    {:else}
        <Accordion.Root
            type="single"
            value={String(data.defaultOpenRound)}
            class="flex flex-col gap-0.5"
        >
            {#each rounds as round (round.nr)}
                {@const matchesWithResult = round.matches.filter((m) => m.result !== null).length}

                {@const totalMatches = round.matches.length}
                {@const roundSpiele =
                    matchesWithResult === totalMatches
                        ? `${totalMatches}`
                        : `${matchesWithResult}/${totalMatches}`}

                <Accordion.Item value={String(round.nr)} class={itemClass}>
                    <Accordion.Trigger class={triggerClass}>
                        <span class="text-sm font-medium">Runde {round.nr}</span>
                        <span class="flex items-center gap-3">
                            <span class="text-subtle text-xs">{roundSpiele} Sp.</span>
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
                                    <th class={cn(thClass, "hidden xs:table-cell w-px px-2")}>
                                        Datum
                                    </th>
                                    <th class={cn(thClass, "hidden sm:table-cell w-px px-2 whitespace-nowrap")}>
                                        Liga
                                    </th>
                                    <th class={cn(thClass, "px-1 xs:px-2")}>Paarung</th>
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-center")}>
                                        Erg.
                                    </th>
                                    <th class={cn(thClass, "w-px px-1 xs:px-2 text-right")}>
                                        Pkt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each round.matches as match (match.nr)}
                                    <tr class="border-input border-b last:border-b-0">
                                        <td class={cn(tdClass, "text-right")}>
                                            <a
                                                href="/spiele/{match.nr}"
                                                class={cn(
                                                    matchLinkClass,
                                                    "text-subtle hover:text-base transition-colors",
                                                )}
                                            >
                                                {match.nr}
                                            </a>
                                        </td>
                                        <td
                                            class="hidden xs:table-cell w-px px-2 py-3 tabular-nums"
                                        >
                                            {match.date ? formatDate(match.date) : "–"}
                                        </td>
                                        <td
                                            class="hidden sm:table-cell w-px px-2 py-3 text-subtle text-xs whitespace-nowrap"
                                        >
                                            {match.liga ?? "–"}
                                        </td>
                                        <td class="px-1 py-3 xs:px-2">
                                            <a href="/spiele/{match.nr}" class={matchLinkClass}>
                                                <span class="hidden sm:inline"
                                                    >{match.paarung}</span
                                                >
                                                <span class="sm:hidden">{match.paarungShort}</span>
                                            </a>
                                        </td>
                                        <td class={cn(tdClass, "text-center")}>
                                            {match.result ?? "–:–"}
                                        </td>
                                        <td class={cn(tdClass, "text-right")}>
                                            {match.points !== null ? match.points : "–"}
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
