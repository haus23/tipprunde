import { Button, DateTimeField } from "@tipprunde/ui";
import { useEffect } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useFetcher } from "react-router";

import { APP_TIME_ZONE } from "#/lib/utils.ts";

type ActionData = { ok: true } | { errors: { startsAt: string[] } } | null;

type StartFormProps = {
  roundId: number;
  startsAt: string | null;
  onClose: () => void;
};

function StartForm({ roundId, startsAt, onClose }: StartFormProps) {
  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const errors = fetcher.data && "errors" in fetcher.data ? fetcher.data.errors : undefined;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && "ok" in fetcher.data) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <fetcher.Form method="post" className="flex flex-col gap-5">
      <input type="hidden" name="intent" value="set-round-start" />
      <input type="hidden" name="roundId" value={roundId} />

      {/* Enter saves, as in a plain input. React Aria's date segments keep the
          key to themselves, so it is caught in the capture phase, before
          they see it. React events bubble through portals, so the calendar
          popover's Enter arrives here too — only targets inside this div in
          the DOM count, and the calendar trigger button keeps its Enter. */}
      <div
        className="flex flex-col gap-1.5"
        onKeyDownCapture={(e) => {
          const target = e.target as Element;
          if (e.key !== "Enter" || isPending) return;
          if (!e.currentTarget.contains(target) || target.closest("button")) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.closest("form")?.requestSubmit();
        }}
      >
        <DateTimeField
          name="startsAt"
          label="Start (Berliner Zeit)"
          defaultValue={startsAt}
          timeZone={APP_TIME_ZONE}
          autoFocus
        />
        <p className="text-subtle text-xs">
          Bis hierhin können die Spieler selbst tippen. Ohne Start ist Tippen in der App gesperrt.
        </p>
        {errors?.startsAt?.map((e) => (
          <p key={e} className="text-error text-xs">
            {e}
          </p>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        {startsAt && (
          <Button
            intent="secondary"
            isDisabled={isPending}
            className="mr-auto"
            onPress={() =>
              void fetcher.submit(
                { intent: "set-round-start", roundId: String(roundId), startsAt: "" },
                { method: "post" },
              )
            }
          >
            Entfernen
          </Button>
        )}
        <Button intent="secondary" onPress={onClose}>
          Abbrechen
        </Button>
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "…" : "Speichern"}
        </Button>
      </div>
    </fetcher.Form>
  );
}

type RoundStartDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roundId: number;
  roundNr: number;
  startsAt: string | null;
};

export function RoundStartDialog({
  isOpen,
  onOpenChange,
  roundId,
  roundNr,
  startsAt,
}: RoundStartDialogProps) {
  const onClose = () => onOpenChange(false);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <Modal className="bg-surface-raised border-subtle w-full max-w-sm rounded-md border shadow-xl outline-none">
        <Dialog className="outline-none">
          <div className="border-subtle border-b px-6 py-4">
            <Heading slot="title" className="text-base font-semibold">
              Start der Runde {roundNr}
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && <StartForm roundId={roundId} startsAt={startsAt} onClose={onClose} />}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
