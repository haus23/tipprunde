<script lang="ts">
    import { Select } from "bits-ui";
    import { goto } from "$app/navigation";
    import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon } from "@lucide/svelte";
    import { cn } from "$lib/utils";

    interface Player {
        name: string | undefined;
        slug: string | undefined;
    }

    interface Props {
        players: Player[];
        currentSlug: string | undefined;
    }

    let { players, currentSlug }: Props = $props();

    const current = $derived(players.find((p) => p.slug === (currentSlug ?? "")));
</script>

<Select.Root
    type="single"
    value={currentSlug ?? ""}
    onValueChange={(value) => goto(`/spieler/${value}`)}
>
    <Select.Trigger
        class={cn(
            "flex w-64 select-none items-center justify-between gap-2",
            "rounded-md border border-input bg-base px-3 py-2",
            "text-lg font-medium tracking-tight outline-none",
            "hover:bg-subtle/70 data-[state=open]:bg-subtle/50",
            "focus-visible:ring-2 focus-visible:ring-focus",
        )}
    >
        <span class="truncate">{current?.name ?? ""}</span>
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
                class={cn("absolute top-0 z-20", "flex h-6 w-full items-center justify-center")}
            >
                <ChevronUpIcon size={16} class="text-subtle" />
            </Select.ScrollUpButton>
            <Select.Viewport class="min-h-0 flex-1 py-1">
                {#each players as p (p.slug)}
                    <Select.Item
                        value={p.slug ?? ""}
                        label={p.name ?? ""}
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
                            <span>{p.name}</span>
                        {/snippet}
                    </Select.Item>
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
