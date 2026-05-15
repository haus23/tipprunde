<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import {
        EllipsisVerticalIcon,
        LogInIcon,
        LogOutIcon,
        MonitorIcon,
        MoonIcon,
        SettingsIcon,
        SunIcon,
    } from "@lucide/svelte";

    import { cn } from "$lib/utils";
    import {
        colorScheme,
        resetScheme,
        toggleScheme,
    } from "$lib/state/color-scheme.svelte";

    interface Props {
        user: App.Locals["user"];
    }
    const { user }: Props = $props();

    const SchemeIcon = $derived(
        colorScheme.effective === "dark" ? MoonIcon : SunIcon,
    );

    const triggerClass = cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-md",
        "text-subtle hover:text-base hover:bg-subtle data-[state=open]:bg-subtle/75",
        "outline-none transition-colors active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-focus",
    );

    const contentClass = cn(
        "min-w-48 rounded-md border border-surface bg-surface p-1 shadow-md outline-none",
        "origin-(--bits-dropdown-menu-content-transform-origin) transition-[transform,scale,opacity]",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
    );

    const itemClass = cn(
        "flex w-full items-center gap-2.5 rounded px-2.5 py-1.5",
        "text-sm select-none outline-none",
        "data-highlighted:bg-subtle",
    );
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger aria-label="Menü öffnen" class={triggerClass}>
        <EllipsisVerticalIcon size="20" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
        <DropdownMenu.Content
            sideOffset={6}
            collisionPadding={8}
            side="bottom"
            align="end"
            alignOffset={-8}
            class={contentClass}
        >
            <DropdownMenu.Item class={itemClass} onSelect={toggleScheme}>
                <span class="flex-1">Hell-/Dunkelmodus</span>
                <SchemeIcon size={14} class="text-subtle shrink-0" />
            </DropdownMenu.Item>
            {#if colorScheme.current !== "system"}
                <DropdownMenu.Item class={itemClass} onSelect={resetScheme}>
                    <span class="pl-2 flex-1 text-subtle">
                        Zurück auf System
                    </span>
                    <MonitorIcon size={14} class="text-subtle shrink-0" />
                </DropdownMenu.Item>
            {/if}
            {#if user}
                <DropdownMenu.Separator class="bg-subtle mx-1 my-1 h-px" />
                <DropdownMenu.Group>
                    <DropdownMenu.GroupHeading
                        class="text-subtle text-xs font-medium px-2.5 py-1.5"
                    >
                        Hallo {user.name}
                    </DropdownMenu.GroupHeading>
                    {#if user.role === "manager" || user.role === "admin"}
                        <DropdownMenu.Item class={itemClass}>
                            {#snippet child({ props })}
                                <a href="/manager" {...props}>
                                    <span class="flex-1">Manager</span>
                                    <SettingsIcon
                                        size={14}
                                        class="text-subtle shrink-0"
                                    />
                                </a>
                            {/snippet}
                        </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Item class={itemClass}>
                        {#snippet child({ props })}
                            <form method="post" action="/logout">
                                <button type="submit" {...props}>
                                    <span class="flex-1 text-left">
                                        Abmelden
                                    </span>
                                    <LogOutIcon
                                        size={14}
                                        class="text-subtle shrink-0"
                                    />
                                </button>
                            </form>
                        {/snippet}
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            {:else}
                <DropdownMenu.Item class={itemClass}>
                    {#snippet child({ props })}
                        <a href="/login" {...props}>
                            <span class="flex-1">Anmelden</span>
                            <LogInIcon size={14} class="text-subtle shrink-0" />
                        </a>
                    {/snippet}
                </DropdownMenu.Item>
            {/if}
        </DropdownMenu.Content>
    </DropdownMenu.Portal>
</DropdownMenu.Root>
