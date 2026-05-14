<script lang="ts">
    import { LineChart, Tooltip } from "layerchart";
    import type { ChartState } from "layerchart";

    import type { ChartPoint, PlayerPoint } from "$lib/server/db/verlauf";
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

    const series = $derived(
        data.players.map((p, i) => ({
            key: `u${p.userId}`,
            label: p.name,
            value: (d: ChartPoint) => d.players[`u${p.userId}`]?.points ?? 0,
            color: COLORS[i % COLORS.length],
        })),
    );

    let context = $state<ChartState<ChartPoint>>();

    const allSelected = $derived(context?.series?.selectedKeys?.isEmpty() ?? true);

    let tooltipRef = $state<HTMLElement | undefined>();

    $effect(() => {
        const el = tooltipRef;
        if (!el) return;
        const clamp = () => {
            const r = el.getBoundingClientRect();
            const ts = window.getComputedStyle(el).transform;
            const m = ts && ts !== "none" ? new DOMMatrix(ts) : new DOMMatrix();
            const rawTop = r.top - m.f;
            const rawBottom = r.bottom - m.f;
            const rawLeft = r.left - m.e;
            const rawRight = r.right - m.e;
            const pad = 8;
            const dy =
                rawTop < pad
                    ? pad - rawTop
                    : rawBottom > innerHeight - pad
                      ? innerHeight - pad - rawBottom
                      : 0;
            const dx =
                rawLeft < pad
                    ? pad - rawLeft
                    : rawRight > innerWidth - pad
                      ? innerWidth - pad - rawRight
                      : 0;
            const t = dx || dy ? `translate(${dx}px,${dy}px)` : "";
            if (el.style.transform !== t) el.style.transform = t;
        };
        const obs = new MutationObserver(clamp);
        obs.observe(el, { attributes: true, attributeFilter: ["style"] });
        return () => obs.disconnect();
    });

</script>

{#snippet tooltip({ context: ctx }: { context: ChartState<ChartPoint> })}
    <Tooltip.Root
        context={ctx}
        contained="window"
        anchor="left"
        bind:rootRef={tooltipRef}
    >
        {#snippet children({ data: point })}
            {@const p = point as ChartPoint}
            <p class="text-subtle mb-1.5 text-[11px] font-normal">
                Spiel {p.matchNr}
            </p>
            {@const visible = ctx.tooltip.series
                .filter((s) => s.visible)
                .toSorted((a, b) => ((b.value as number) ?? 0) - ((a.value as number) ?? 0))}
            {#each visible as s, i (s.key)}
                {@const rank = (p.players[s.key] as PlayerPoint)?.rank ?? 0}
                <div class="flex items-center justify-between gap-3 pr-1">
                    <div class="label flex items-center gap-1.5">
                        <span class="text-subtle w-6 shrink-0 text-right tabular-nums"
                            >{i === 0 || rank !== ((p.players[visible[i - 1].key] as PlayerPoint)?.rank ?? 0)
                                ? `${rank}.`
                                : ""}</span
                        >
                        <span
                            class="size-1.5 shrink-0 rounded-full"
                            style="background-color: {s.color}"
                        ></span>
                        <span>{s.label}</span>
                    </div>
                    <span class="tabular-nums font-medium">{s.value}</span>
                </div>
            {/each}
        {/snippet}
    </Tooltip.Root>
{/snippet}

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
            class="xs:mx-4 bg-surface border-surface xs:rounded-md xs:border border-y px-4 pt-4 pb-5"
            style="--color-surface-100: var(--background-color-surface); --color-surface-content: var(--text-color-base); --color-primary: var(--background-color-accent)"
        >
            <div class="h-[min(420px,60svh)] min-h-45">
                <LineChart
                    bind:context
                    data={data.chartData}
                    x="matchNr"
                    {series}
                    {tooltip}
                    legend={false}
                    padding={{ top: 8, right: 0, bottom: 32, left: 16 }}
                />
            </div>
            <div class="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {#each series as s (s.key)}
                    <button
                        onclick={() => context?.series?.selectedKeys?.toggle(s.key)}
                        class="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-xs transition-opacity hover:bg-subtle {allSelected
                            ? 'opacity-75'
                            : !context?.series?.isVisible(s.key)
                              ? 'opacity-35'
                              : ''}"
                    >
                        <span
                            class="size-2.5 shrink-0 rounded-full"
                            style="background-color: {s.color}"
                        ></span>
                        <span class="text-subtle">{s.label}</span>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>
