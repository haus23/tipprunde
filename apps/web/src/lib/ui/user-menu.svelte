<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import { browser } from "$app/environment";
    import {
        EllipsisVerticalIcon,
        MonitorIcon,
        MoonIcon,
        SunIcon,
    } from "@lucide/svelte";

    const schemes = ["system", "light", "dark"] as const;
    type ColorScheme = (typeof schemes)[number];
    const schemeIcons = { system: MonitorIcon, light: SunIcon, dark: MoonIcon };

    const stored = browser ? localStorage.getItem("color-scheme") : null;
    const initial: ColorScheme = schemes.includes(stored as ColorScheme)
        ? (stored as ColorScheme)
        : "system";
    let current = $state<ColorScheme>(initial);

    let SchemeIcon = $derived(schemeIcons[current]);

    const itemClass =
        "flex w-full cursor-default items-center gap-2.5 rounded px-2.5 py-1.5 text-sm outline-none select-none data-highlighted:bg-subtle";

    function next() {
        current = schemes[(schemes.indexOf(current) + 1) % schemes.length];
        localStorage.setItem("color-scheme", current);
        document.documentElement.setAttribute("data-color-scheme", current);
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger
        aria-label="Menü öffnen"
        class="text-subtle hover:text-base hover:bg-subtle data-[state=open]:bg-subtle/75 focus-visible:ring-focus flex size-8 cursor-pointer items-center justify-center rounded-md outline-none transition-colors active:scale-95 focus-visible:ring-2"
    >
        <EllipsisVerticalIcon size="20" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
        <DropdownMenu.Content
            sideOffset={6}
            collisionPadding={8}
            class="data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 origin-(--bits-dropdown-menu-content-transform-origin) transition-[transform,scale,opacity] bg-surface border-surface min-w-48 rounded-md border p-2 shadow-md outline-none"
        >
            <DropdownMenu.Item class={itemClass} onSelect={next}>
                <span class="flex-1">Hell-/Dunkelmodus</span>
                <SchemeIcon size={14} class="text-subtle shrink-0" />
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Portal>
</DropdownMenu.Root>
