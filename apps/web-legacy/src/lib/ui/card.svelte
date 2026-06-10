<script lang="ts">
    const { children, title } = $props();
</script>

<div class="bg-surface border-surface flex flex-col rounded-md border">
    <div class="border-input border-b px-4 py-3">
        <h2 class="font-semibold">{title}</h2>
    </div>
    <div class="flex flex-1 flex-col px-4 py-3">
        {@render children()}
    </div>
</div>
