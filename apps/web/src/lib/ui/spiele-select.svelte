<script lang="ts">
    import { Select } from "bits-ui";

    interface Match {
        nr: number;
        paarung: string;
        paarungShort: string;
        points: number | null;
    }

    interface Round {
        nr: number;
        matches: Match[];
    }

    interface Props {
        rounds: Round[];
        currentNr: number;
    }

    let { rounds, currentNr }: Props = $props();
</script>

<Select.Root type="single" value={String(currentNr)}>
    <Select.Trigger>
        <Select.Value />
    </Select.Trigger>
    <Select.Portal>
        <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport>
                {#each rounds as r}
                    <Select.Group>
                        <Select.GroupHeading>Runde {r.nr}</Select.GroupHeading>
                        {#each r.matches as m}
                            <Select.Item value={String(m.nr)}>
                                {m.paarung}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                {/each}
            </Select.Viewport>
        </Select.Content>
    </Select.Portal>
</Select.Root>
