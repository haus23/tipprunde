<script lang="ts">
    import SpieleSelect from "$ui/spiele-select.svelte";
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    let nr = $derived(Number(params.nr));
</script>

<div class="mx-auto w-full max-w-5xl py-8">
    <div class="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 class="text-2xl font-semibold tracking-tight">Ein Spiel</h1>
    </div>
    <SpieleSelect currentNr={nr} rounds={data.roundsWithMatches} />
</div>
