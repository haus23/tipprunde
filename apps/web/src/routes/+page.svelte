<script lang="ts">
    import Card from "$ui/card.svelte";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-5xl px-2 xs:px-4 py-8 flex flex-col gap-8">
    <div class="flex flex-col items-center">
        <p class="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 class="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p class="text-subtle mt-1 text-lg">{data.championship.name}</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:row-span-2">
            <Card
                title={data.championship.completed
                    ? "Abschlusstabelle"
                    : "Aktuelle Tabelle"}
            >
                <table class="w-full text-sm">
                    <tbody>
                        {#each data.ranking as entry, index}
                            <tr class="border-input border-b last:border-b-0">
                                <td
                                    class="w-px py-2 pr-3 text-right tabular-nums"
                                >
                                    {entry.rank !==
                                    data.ranking[index - 1]?.rank
                                        ? entry.rank
                                        : ""}
                                </td>
                                <td class="py-2">
                                    <a
                                        href={`/spieler?name=${entry.slug}`}
                                        class="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                                    >
                                        {entry.name}
                                    </a>
                                </td>
                                <td
                                    class="py-2 text-right font-medium tabular-nums"
                                    >{entry.points}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="mt-3 flex items-center justify-end gap-4">
                    <a
                        href="/verlauf"
                        class="text-subtle hover:text-base text-xs transition-colors"
                        >Verlauf →</a
                    >
                    <a
                        href="/tabelle"
                        class="text-subtle hover:text-base text-xs transition-colors"
                        >Vollständige Tabelle →</a
                    >
                </div>
            </Card>
        </div>
        <Card
            title={data.championship.completed
                ? "Letzte Spiele"
                : "Aktuelle Spiele"}
        >
            <table class="w-full text-sm">
                <tbody> </tbody>
            </table>
        </Card>
    </div>
</div>
