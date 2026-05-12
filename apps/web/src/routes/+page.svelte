<script lang="ts">
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-5xl px-4 py-8">
    <div class="flex flex-col items-center">
        <p class="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 class="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p class="text-subtle mt-1 text-lg">{data.championship?.name}</p>
    </div>
</div>
