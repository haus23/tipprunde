<script lang="ts">
    import { Select } from "bits-ui";
    import { goto } from "$app/navigation";
    import {
        CheckIcon,
        ChevronDownIcon,
        ChevronUpIcon,
        ChevronsUpDownIcon,
    } from "@lucide/svelte";
    import { cn } from "$lib/utils";

    interface Match {
        nr: number;
        paarung: string;
        paarungShort: string;
        points: number | null;
    }

    interface Round {
        nr: number;
        matches: Match[];
    }

    interface Props {
        rounds: Round[];
        currentNr: number;
    }

    let { rounds, currentNr }: Props = $props();

    const allMatches = $derived(rounds.flatMap((r) => r.matches));
    const current = $derived(allMatches.find((m) => m.nr === currentNr));
</script>

<Select.Root
    type="single"
    value={String(currentNr)}
    onValueChange={(value) => goto(`/spiele/${value}`)}
>
    <Select.Trigger
        class={cn(
            "flex w-80 select-none items-center justify-between gap-2",
            "rounded-md border border-input bg-base px-3 py-2",
            "text-lg font-medium tracking-tight outline-none",
            "hover:bg-subtle/70 data-[state=open]:bg-subtle/50",
            "focus-visible:ring-2 focus-visible:ring-focus",
        )}
    >
        <span class="truncate">{current?.paarungShort}</span>
        <span class="flex shrink-0 text-subtle">
            <ChevronsUpDownIcon size={18} />
        </span>
    </Select.Trigger>
    <Select.Portal>
        <Select.Content
            sideOffset={8}
            collisionPadding={16}
            align="center"
            class={cn(
                "relative z-50 flex flex-col overflow-hidden",
                "min-w-(--bits-select-anchor-width) max-h-(--bits-select-content-available-height)",
                "rounded-md border border-input bg-base shadow-md outline-none",
                "transition-[transform,opacity] duration-150",
                "data-[state=open]:scale-100 data-[state=open]:opacity-100",
                "data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
            )}
            style="transform-origin: var(--bits-select-content-transform-origin)"
        >
            <Select.ScrollUpButton
                class={cn(
                    "absolute top-0 z-20",
                    "flex h-6 w-full items-center justify-center",
                )}
            >
                <ChevronUpIcon size={16} class="text-subtle" />
            </Select.ScrollUpButton>
            <Select.Viewport class="min-h-0 flex-1">
                {#each rounds as r, index (r.nr)}
                    <Select.Group>
                        <Select.GroupHeading
                            class={cn(
                                "sticky top-0 z-10 bg-base",
                                "px-4 pb-1 pt-2",
                                "text-[0.6875rem] font-bold uppercase tracking-wider text-subtle",
                            )}
                        >
                            Runde {r.nr}
                        </Select.GroupHeading>
                        {#each r.matches as m (m.nr)}
                            <Select.Item
                                value={String(m.nr)}
                                label={m.paarung}
                                class={cn(
                                    "relative flex select-none items-center",
                                    "cursor-default py-2 pl-8 pr-4",
                                    "text-sm outline-none",
                                    "data-highlighted:bg-subtle",
                                )}
                            >
                                {#snippet children({ selected })}
                                    {#if selected}
                                        <span class="absolute left-2.5 flex items-center">
                                            <CheckIcon size={12} />
                                        </span>
                                    {/if}
                                    <span class="flex-1">
                                        <span class="xs:hidden">{m.paarungShort}</span>
                                        <span class="hidden xs:inline">{m.paarung}</span>
                                    </span>
                                    {#if m.points !== null}
                                        <span class="ml-4 shrink-0 text-xs text-subtle">
                                            {m.points} Pkt
                                        </span>
                                    {/if}
                                {/snippet}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                {/each}
            </Select.Viewport>
            <Select.ScrollDownButton
                class={cn(
                    "absolute bottom-0 z-20 bg-base",
                    "flex h-6 w-full items-center justify-center",
                )}
            >
                <ChevronDownIcon size={16} class="text-subtle" />
            </Select.ScrollDownButton>
        </Select.Content>
    </Select.Portal>
</Select.Root>
