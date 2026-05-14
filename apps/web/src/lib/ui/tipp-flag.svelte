<script lang="ts">
    import { Popover } from "bits-ui";

    interface Props {
        label?: string;
    }

    let { label = "Joker-Tipp" }: Props = $props();
</script>

<Popover.Root>
    <Popover.Trigger
        aria-label={label}
        class="text-accent focus-visible:ring-focus absolute top-1/2 -right-1 -translate-y-1/2 cursor-default rounded text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2 xs:right-1"
    >
        ★
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content
            side="top"
            sideOffset={8}
            collisionPadding={{ top: 56 }}
            class="relative z-50 rounded bg-inverted px-2 py-0.5 text-xs whitespace-nowrap text-inverted"
        >
            {label}
            <Popover.Arrow
                class="bg-inverted absolute size-2 rotate-45 rounded-[1px] data-[side=bottom]:-top-1 data-[side=top]:-bottom-1"
            />
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>
