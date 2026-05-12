<script lang="ts">
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

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
            <a
                href="/verlauf"
                class="text-subtle hover:text-base focus-visible:ring-focus rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-base"
            >
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
                    <th
                        class="text-subtle w-px px-2 pt-2 pb-3 text-right text-xs font-medium tracking-wide uppercase"
                    >
                        Platz
                    </th>
                    <th
                        class="text-subtle px-2 pt-2 pb-3 text-left text-xs font-medium tracking-wide uppercase"
                    >
                        Spieler
                    </th>
                    <th
                        class="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase"
                    >
                        Punkte
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each data.ranking as entry, index}
                    <tr class="border-input border-b last:border-b-0">
                        <td class="w-px px-2 py-3 text-right tabular-nums">
                            {entry.rank !== data.ranking[index - 1]?.rank
                                ? entry.rank
                                : ""}
                        </td>
                        <td class="px-2 py-3 text-left">
                            <a
                                href={`/spieler?name=${entry.slug}`}
                                class="text-subtle hover:text-base focus-visible:ring-focus rounded font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                            >
                                {entry.name}
                            </a>
                        </td>
                        <td
                            class="px-2 py-3 text-center font-medium tabular-nums"
                            >{entry.points}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
