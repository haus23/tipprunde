import { revalidateLogic, useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { Button } from "~/components/ui/button";
import { CodeInput } from "~/components/ui/code-input";

const codeSchema = v.pipe(
  v.string(),
  v.nonEmpty("Du musst Deinen Code eingeben, um fortzufahren."),
  v.length(
    6,
    ({ received }) =>
      `Ein Code hat sechs Zeichen. Du hast nur ${received} eingegeben.`,
  ),
);

export const Route = createFileRoute("/_foh/(auth)/verify")({
  head: () => ({
    meta: [
      {
        title: "Einlass - runde.tips",
      },
      {
        name: "description",
        content:
          "Einlass zum Hinterhof bei der Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: { code: "" },
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
      <h1 className="text-2xl font-medium">Einlass</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col items-center gap-4"
      >
        <form.Field
          name="code"
          validators={{
            onDynamic: codeSchema,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-1 items-center">
                <label htmlFor={field.name} className="text-sm font-semibold">
                  Email
                </label>
                <CodeInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(code) => field.handleChange(code)}
                  autoFocus
                  autoComplete="one-time-code"
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
                Code prüfen
              </Button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
