<script lang="ts">
    import {
        Checkbox,
        PinInput,
        REGEXP_ONLY_DIGITS,
        type PinInputRootSnippetProps,
    } from "bits-ui";
    import { cn } from "$lib/utils";
    import type { PageData, ActionData } from "./$types";
    import { CheckIcon } from "@lucide/svelte";
    type CellProps = PinInputRootSnippetProps["cells"][0];

    const { data, form }: { data: PageData; form: ActionData } = $props();
    let step = $derived(form?.step ?? data.step);
    let email = $derived(form?.email ?? data.email);

    const inputClass = cn(
        "w-full rounded-md border border-input bg-base px-3 py-2",
        "text-sm text-base placeholder:text-subtle",
        "outline-none transition",
        "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    );

    const btnClass = cn(
        "rounded-lg px-4 py-2.5 text-sm font-medium outline-none transition",
        "active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    );

    const btnPrimaryClass = cn(btnClass, "bg-accent hover:bg-accent-hovered text-white");

    const btnSecondaryClass = cn(btnClass, "border border-input bg-surface hover:bg-subtle text-base");

    const checkboxClass = cn(
        "flex size-5 items-center justify-center rounded border border-input",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "data-[state=checked]:bg-accent",
    );

    const pinCellClass = cn(
        "relative h-14 w-10 text-[2rem] text-base",
        "border-input border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
    );
</script>

<svelte:head>
    <title>Anmelden · runde.tips</title>
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-12">
    <div
        class="border-surface bg-surface flex w-full max-w-lg flex-col gap-6 rounded-xl border p-8"
    >
        <h1 class="text-2xl font-medium text-center">Anmeldung</h1>
        {#if step === "email"}
            <form
                method="POST"
                action="?/requestCode"
                class="flex flex-col gap-4 items-center"
            >
                <label class="flex flex-col gap-1.5 w-full">
                    <span class="text-sm font-medium">E-Mail</span>
                    <input
                        value={email}
                        type="email"
                        name="email"
                        required
                        placeholder="deine@email.de"
                        autocomplete="email"
                        class={inputClass}
                    />
                </label>
                {#if form?.error}
                    <p class="text-sm text-error">{form.error}</p>
                {/if}
                <button type="submit" class={cn(btnPrimaryClass, "w-full")}>
                    Code anfordern
                </button>
            </form>
        {:else}
            <div class="flex flex-col gap-4">
                <form
                    method="POST"
                    action="?/verifyCode"
                    class="flex flex-col gap-4 items-center"
                >
                    <p class="text-subtle text-sm">
                        Code wurde an <span class="text-base font-medium"
                            >{email}</span
                        > gesendet.
                    </p>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-sm font-medium">Code</span>

                        <PinInput.Root
                            class="group/pininput text-base flex items-center"
                            name="code"
                            maxlength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            {#snippet children({ cells })}
                                <div class="flex">
                                    {#each cells as cell}
                                        {@render Cell(cell)}
                                    {/each}
                                </div>
                            {/snippet}
                        </PinInput.Root>
                        {#snippet Cell(cell: CellProps)}
                            <PinInput.Cell
                                {cell}
                                class={cn(
                                    pinCellClass,
                                    "flex items-center justify-center transition-all duration-75",
                                    "group-focus-within/pininput:border-input group-hover/pininput:border-input",
                                    "outline-0 data-active:ring-2 data-active:ring-focus",
                                )}
                            >
                                {#if cell.char !== null}
                                    <div>
                                        {cell.char}
                                    </div>
                                {/if}
                                {#if cell.hasFakeCaret}
                                    <div
                                        class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center"
                                    >
                                        <div
                                            class="h-8 w-px bg-base-inverted"
                                        ></div>
                                    </div>
                                {/if}
                            </PinInput.Cell>
                        {/snippet}
                    </label>

                    <label class="flex items-center gap-2 text-sm">
                        <Checkbox.Root
                            name="rememberMe"
                            checked={form?.rememberMe}
                            class={checkboxClass}
                        >
                            {#snippet children({ checked })}
                                {#if checked}
                                    <CheckIcon size="16" class="text-white" />
                                {/if}
                            {/snippet}
                        </Checkbox.Root>
                        Angemeldet bleiben
                    </label>
                    {#if form?.error}
                        <p class="text-sm text-error">{form.error}</p>
                    {/if}
                    <div class="flex flex-col w-full">
                        <button type="submit" class={btnPrimaryClass}>
                            Einloggen
                        </button>
                    </div>
                </form>
                <form method="post" action="?/startOver">
                    <button type="submit" class={cn(btnSecondaryClass, "w-full")}>
                        Andere E-Mail verwenden
                    </button>
                </form>
            </div>
        {/if}
    </div>
</div>
