<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.ico";
    import Logo from "$ui/logo.svelte";
    import UserMenu from "$ui/user-menu.svelte";

    const { children, data } = $props();

    const navLinkClasses =
        "rounded-md px-3 py-1.5 text-sm font-medium text-subtle outline-none transition hover:bg-subtle hover:text-base active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-focus";
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-svh flex-col">
    <header class="border-layout bg-base sticky top-0 h-14 border-b">
        <div
            class="mx-auto grid h-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4"
        >
            <div class="flex">
                <a
                    href="/"
                    class="focus-visible:ring-focus flex items-center gap-2 rounded px-1 pb-0.5 outline-hidden focus-visible:ring-2"
                >
                    <span class="text-accent size-8">
                        <Logo />
                    </span>
                    <span
                        class="hidden pr-2 text-sm font-semibold tracking-tight sm:block"
                    >
                        runde.tips
                    </span>
                </a>
            </div>
            <nav class="flex items-center gap-1">
                <a href="/tabelle" class={navLinkClasses}>Tabelle</a>
                <a href="/spieler" class={navLinkClasses}>Spieler</a>
                <a href="/spiel" class={navLinkClasses}>Spiele</a>
            </nav>
            <div class="flex items-center justify-end">
                <UserMenu user={data.user} />
            </div>
        </div>
    </header>
    <main>{@render children()}</main>
</div>
