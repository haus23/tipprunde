import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";

export function LoginForm() {
  return (
    <Form className="flex flex-col gap-4">
      <TextField type="email" name="email" isRequired className="flex flex-col gap-1">
        <Label>E-Mail</Label>
        <Input placeholder="deine@email.de" autoComplete="email" />
        <FieldError>
          {({ validationDetails }) =>
            validationDetails.valueMissing
              ? "Ohne Email geht das nicht."
              : "Das sieht nicht aus wie eine Email-Adresse."
          }
        </FieldError>
      </TextField>
      <Button type="submit">Code anfordern</Button>
    </Form>
  );
}
