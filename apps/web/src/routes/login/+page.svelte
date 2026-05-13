<script lang="ts">
    import {
        Checkbox,
        PinInput,
        REGEXP_ONLY_DIGITS,
        type PinInputRootSnippetProps,
    } from "bits-ui";
    import type { PageData, ActionData } from "./$types";
    import { CheckIcon } from "@lucide/svelte";
    type CellProps = PinInputRootSnippetProps["cells"][0];

    const { data, form }: { data: PageData; form: ActionData } = $props();
    let step = $derived(form?.step ?? data.step);
    let email = $derived(form?.email ?? data.email);

    const inputClass =
        "w-full rounded-md border border-input bg-base px-3 py-2 text-sm text-base outline-none transition focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface placeholder:text-subtle";
    const btnPrimaryClass =
        "rounded-lg bg-accent hover:bg-accent-hovered px-4 py-2.5 text-sm font-medium text-white outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
    const btnSecondaryClass =
        "rounded-lg bg-surface border border-input hover:bg-subtle px-4 py-2.5 text-sm font-medium text-base outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
    const pinInputCellClass = [
        "relative h-14 w-10 text-[2rem]",
        "border-input border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
        "text-base",
    ].join(" ");
</script>

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
                <button type="submit" class={btnPrimaryClass + " w-full"}>
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
                                class={[
                                    "relative h-14 w-10 text-[2rem]",
                                    "flex items-center justify-center",
                                    "transition-all duration-75",
                                    "border-input border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
                                    "text-base group-focus-within/pininput:border-input group-hover/pininput:border-input",
                                    "outline-0",
                                    "data-active:ring-2 data-active:ring-focus",
                                ].join(" ")}
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
                            class="size-5 focus-visible:ring-2 outline-none focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[state=checked]:bg-accent rounded border border-input flex items-center justify-center"
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
                    <button type="submit" class={btnSecondaryClass + " w-full"}>
                        Andere E-Mail verwenden
                    </button>
                </form>
            </div>
        {/if}
    </div>
</div>
