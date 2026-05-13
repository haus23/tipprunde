<script lang="ts">
    import type { PageData, ActionData } from "./$types";

    const { data, form }: { data: PageData; form: ActionData } = $props();
    let step = $derived(form?.step ?? data.step);
    let email = $derived(form?.email ?? data.email);

    const inputClass =
        "w-full rounded-md border border-input bg-base px-3 py-2 text-sm text-base outline-none transition focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface placeholder:text-subtle";
    const btnPrimaryClass =
        "rounded-lg bg-accent hover:bg-accent-hovered px-4 py-2.5 text-sm font-medium text-white outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
    const btnSecondaryClass =
        "rounded-lg bg-surface border border-input hover:bg-subtle px-4 py-2.5 text-sm font-medium text-base outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
</script>

<div class="flex flex-1 items-center justify-center px-4 py-12">
    <div
        class="border-surface bg-surface flex w-full max-w-lg flex-col gap-6 rounded-xl border p-8"
    >
        <h1 class="text-2xl font-medium">Anmeldung</h1>
        {#if step === "email"}
            <form
                method="POST"
                action="?/requestCode"
                class="flex flex-col gap-4"
            >
                <label class="flex flex-col gap-1.5">
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
                <button type="submit" class={btnPrimaryClass}>
                    Code anfordern
                </button>
            </form>
        {:else}
            <form
                method="POST"
                action="?/verifyCode"
                class="flex flex-col gap-4"
            >
                <p class="text-subtle text-sm">
                    Code wurde an <span class="text-base font-medium"
                        >{email}</span
                    > gesendet.
                </p>
                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium">Code</span>
                    <input
                        type="text"
                        name="code"
                        required
                        pattern="[0-9]{'{'}6}"
                        maxlength="6"
                        inputmode="numeric"
                        autocomplete="one-time-code"
                        placeholder="123456"
                        class={inputClass}
                    />
                </label>
                <label class="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        class="size-4 cursor-pointer accent-(--background-color-accent)"
                        checked={form?.rememberMe}
                    />
                    Angemeldet bleiben
                </label>
                {#if form?.error}
                    <p class="text-sm text-error">{form.error}</p>
                {/if}
                <div class="flex flex-col gap-2">
                    <button type="submit" class={btnPrimaryClass}>
                        Einloggen
                    </button>
                    <a href="/login" class={btnSecondaryClass + " text-center"}>
                        Andere E-Mail verwenden
                    </a>
                </div>
            </form>
        {/if}
    </div>
</div>
