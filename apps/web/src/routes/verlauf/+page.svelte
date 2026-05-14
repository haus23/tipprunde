<script lang="ts">
    import { LineChart } from "layerchart";

    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const COLORS = [
        "oklch(65% 0.20 45)",
        "oklch(60% 0.22 240)",
        "oklch(55% 0.20 145)",
        "oklch(60% 0.20 300)",
        "oklch(62% 0.22 20)",
        "oklch(65% 0.20 195)",
        "oklch(68% 0.18 65)",
        "oklch(60% 0.20 320)",
        "oklch(60% 0.20 265)",
        "oklch(60% 0.20 170)",
        "oklch(65% 0.20 85)",
        "oklch(55% 0.20 10)",
    ];

    const series = $derived(data.players.map((p, i) => ({
        key: `u${p.userId}`,
        label: p.name,
        value: `u${p.userId}`,
        color: COLORS[i % COLORS.length],
    })));
</script>

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 class="text-2xl font-semibold tracking-tight">
            {data.championship.name}
        </h1>
        <div class="flex items-center gap-4 text-sm">
            <a
                href="/tabelle"
                class="text-subtle hover:text-base focus-visible:ring-focus rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-base"
            >
                {data.championship.completed
                    ? "Abschlusstabelle"
                    : "Aktuelle Tabelle"}
            </a>
            <span class="font-medium">Punkteverlauf</span>
        </div>
    </div>

    {#if data.chartData.length === 0}
        <div
            class="xs:mx-4 bg-surface border-surface xs:rounded-md xs:border flex items-center justify-center border-y py-16 text-sm text-subtle"
        >
            Noch keine Ergebnisse
        </div>
    {:else}
        <div
            class="xs:mx-4 bg-surface border-surface xs:rounded-md xs:border h-[480px] border-y p-4"
            style="--color-surface-100: var(--background-color-surface); --color-surface-content: var(--text-color-base); --color-primary: var(--background-color-accent)"
        >
            <LineChart
                data={data.chartData}
                x="matchNr"
                {series}
                legend={true}
                padding={{ top: 8, right: 8, bottom: 32, left: 48 }}
            />
        </div>
    {/if}
</div>
