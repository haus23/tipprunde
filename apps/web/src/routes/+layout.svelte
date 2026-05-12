<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.ico";

    const { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex min-h-svh flex-col">
    <main>{@render children()}</main>
</div>
