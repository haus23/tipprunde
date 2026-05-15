<script lang="ts">
    import { cn } from "$lib/utils";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    let currentUserId = $state<number | undefined>(undefined);
    $effect(() => { currentUserId = data.user?.id; });

    const thClass = cn("text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase");
    const tdClass = cn("px-2 py-3 tabular-nums");

    const subNavLinkClass = cn(
        "rounded outline-none transition-colors",
        "text-subtle hover:text-base",
        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-base focus-visible:ring-focus",
    );

    const playerLinkClass = cn(
        "rounded font-medium outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:ring-focus",
    );
</script>

<svelte:head>
    <title>Tabelle · {data.championship.name}</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 class="text-2xl font-semibold tracking-tight">
            {data.championship.name}
        </h1>
        <div class="flex items-center gap-4 text-sm">
            <span class="font-medium">
                {data.championship.completed
                    ? "Abschlusstabelle"
                    : "Aktuelle Tabelle"}</span
            >
            <a href="/verlauf" class={subNavLinkClass}>
                Punkteverlauf
            </a>
        </div>
    </div>
    <div
        class="xs:mx-4 bg-surface border-surface xs:rounded-md xs:border border-y px-2 xs:px-4 py-2"
    >
        <table class="w-full text-sm">
            <thead>
                <tr class="border-input border-b text-left">
                    <th class={cn(thClass, "w-px text-right")}>Platz</th>
                    <th class={cn(thClass, "text-left")}>Spieler</th>
                    <th class={cn(thClass, "w-px text-center")}>Punkte</th>
                </tr>
            </thead>
            <tbody>
                {#each data.ranking as entry, index}
                    <tr class="border-input border-b last:border-b-0">
                        <td class={cn(tdClass, "w-px text-right")}>
                            {entry.rank !== data.ranking[index - 1]?.rank
                                ? entry.rank
                                : ""}
                        </td>
                        <td class={cn(tdClass, "text-left")}>
                            <a
                                href={`/spieler/${entry.slug}`}
                                class={cn(
                                    playerLinkClass,
                                    currentUserId === entry.userId
                                        ? "text-accent"
                                        : "text-subtle hover:text-base",
                                )}
                            >
                                {entry.name}
                            </a>
                        </td>
                        <td class={cn(tdClass, "text-center font-medium")}>{entry.points}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
