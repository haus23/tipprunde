import { revalidateLogic, useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_foh/(auth)/login")({
  head: () => ({
    meta: [
      {
        title: "Anmeldung - runde.tips",
      },
      {
        name: "description",
        content: "Anmeldung bei der Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty("Ohne Email-Adresse geht es nicht!"),
  v.email("Das ist keine gültige Email-Adresse."),
);

function RouteComponent() {
  const form = useForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),

    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Anmeldung</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field
          name="email"
          validators={{
            onDynamic: emailSchema,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-1">
                <label htmlFor={field.name} className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="email"
                  className="px-3 py-1.5 border"
                />
                {field.state.meta.errors.length > 0 && (
                  <em className="text-sm italic">
                    {field.state.meta.errors.at(0)?.message}
                  </em>
                )}
              </div>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <div>
              <Button type="submit" isDisabled={!canSubmit} variant="primary">
                Code anfordern
              </Button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
