import { Button } from "@tipprunde/ui";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useFetcher } from "react-router";

type SessionsFormProps = {
  userId: number;
  name: string;
  onClose: () => void;
};

function SessionsForm({ userId, name, onClose }: SessionsFormProps) {
  const fetcher = useFetcher<{ revoked?: boolean; errors?: { revoke: string[] } }>();
  const isPending = fetcher.state !== "idle";
  const isDone = fetcher.state === "idle" && fetcher.data !== undefined;
  const error = fetcher.data?.errors?.revoke?.[0];

  // No auto-close on success, unlike the other dialogs in this folder: nothing
  // else on this page visibly changes, so closing silently would leave no
  // sign that anything happened at all.
  if (isDone && !error) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm">
          Alle Sitzungen von <span className="font-medium">{name}</span> wurden beendet.
        </p>
        <div className="flex justify-end">
          <Button onPress={onClose}>Schließen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm">
        Alle Sitzungen von <span className="font-medium">{name}</span> werden beendet. {name} muss
        sich beim nächsten Besuch neu anmelden — die E-Mail-Adresse bleibt unverändert.
      </p>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex justify-end gap-3">
        <Button intent="secondary" onPress={onClose} isDisabled={isPending}>
          Abbrechen
        </Button>
        <Button
          isDisabled={isPending}
          onPress={() =>
            void fetcher.submit(
              { intent: "revoke-sessions", userId: String(userId) },
              { method: "post" },
            )
          }
        >
          {isPending ? "…" : "Sitzungen beenden"}
        </Button>
      </div>
    </div>
  );
}

type SessionsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  name: string;
};

/**
 * Confirm-and-revoke, admin only — see spieler.tsx's own gate on the action.
 * Deliberately does not touch the address: this is "kick this account out
 * everywhere right now", not the side effect that already follows an address
 * change.
 */
export function SessionsDialog({ isOpen, onOpenChange, userId, name }: SessionsDialogProps) {
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
              Sitzungen beenden
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && <SessionsForm userId={userId} name={name} onClose={onClose} />}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
