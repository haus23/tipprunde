'use client';
import { Button } from '@/components/(ui)/button';
import { Form } from '@/components/(ui)/form';
import { Input, Label, TextField } from '@/components/(ui)/text-field';

export function LoginForm() {
  return (
    <Form className="flex flex-col gap-4">
      <TextField type="email" name="email" isRequired className="flex flex-col gap-1">
        <Label>E-Mail</Label>
        <Input placeholder="deine@email.de" />
      </TextField>
      <Button type="submit">Code anfordern</Button>
    </Form>
  );
}
