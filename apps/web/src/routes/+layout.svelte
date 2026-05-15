<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.ico";
    import { MoonIcon, SunIcon } from "@lucide/svelte";
    import Logo from "$ui/logo.svelte";
    import UserMenu from "$ui/user-menu.svelte";
    import { page } from "$app/state";
    import { cn } from "$lib/utils";
    import { colorScheme, toggleScheme } from "$lib/state/color-scheme.svelte";
    import { fetchUser } from "$lib/state/user.svelte";

    $effect(() => { fetchUser(); });

    const { children, data } = $props();

    const isActive = (path: string) =>
        page.url.pathname === path || page.url.pathname.startsWith(path + "/");

    const SchemeIcon = $derived(
        colorScheme.effective === "dark" ? MoonIcon : SunIcon,
    );

    const navLinkClasses = cn(
        "rounded-md px-2 xs:px-3 py-1.5",
        "text-sm font-medium text-subtle",
        "outline-none transition hover:bg-subtle hover:text-base active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-focus",
    );

    const schemeBtnClass = cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-md",
        "text-subtle hover:text-base hover:bg-subtle",
        "outline-none transition-colors active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-focus",
    );
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-svh flex-col">
    <header class="border-layout bg-base sticky top-0 z-10 h-14 border-b">
        <div
            class="mx-auto grid h-full max-w-5xl grid-cols-[auto_1fr_auto] xs:grid-cols-[1fr_auto_1fr] items-center px-2 xs:px-4"
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
            <nav class="flex h-full items-center justify-center gap-1">
                {#each [{ href: "/tabelle", label: "Tabelle" }, { href: "/spieler", label: "Spieler" }, { href: "/spiele", label: "Spiele" }] as item}
                    <div
                        class="flex h-full items-center has-aria-[current=page]:border-b-2 has-aria-[current=page]:border-accent"
                    >
                        <a
                            href={item.href}
                            aria-current={isActive(item.href)
                                ? "page"
                                : undefined}
                            class={navLinkClasses}>{item.label}</a
                        >
                    </div>
                {/each}
            </nav>
            <div class="flex items-center justify-end gap-1">
                <button
                    onclick={toggleScheme}
                    aria-label="Farbschema wechseln"
                    class={schemeBtnClass}
                >
                    <SchemeIcon size={18} />
                </button>
                <UserMenu />
            </div>
        </div>
    </header>
    <main>{@render children()}</main>
</div>
