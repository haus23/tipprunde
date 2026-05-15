<script lang="ts">
    import { page } from "$app/state";
    import { HouseIcon } from "@lucide/svelte";
    import { cn } from "$lib/utils";
</script>

<svelte:head>
    <title>{page.status} · runde.tips</title>
</svelte:head>

<div
    class="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center"
>
    <p class="text-error/75 text-8xl font-bold tabular-nums">{page.status}</p>
    <p class="text-lg">{page.error?.message}</p>
    {#if !page.error?.message}
        <p class="text-subtle text-sm">Bitte Micha Bescheid sagen.</p>
    {/if}
    <a
        href="/"
        class={cn(
            "mt-4 flex items-center gap-1.5 rounded text-sm outline-none",
            "text-subtle hover:text-base transition-colors",
            "focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-base focus-visible:ring-focus",
        )}
    >
        <HouseIcon size={14} />
        Zur Startseite
    </a>
</div>
