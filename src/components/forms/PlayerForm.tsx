import { useForm } from 'react-hook-form';

import TextField from '../atoms/TextField';
import Button from '@/components/atoms/Button';
import { Player } from '@/api/model/player';
import { usePlayers } from '@/api/hooks/use-players';
import { emailRegEx } from '@/core/helpers/email-re';
import { slugify } from '@/core/helpers/slugify';

type PlayerFormProps = {
  onDone: () => void;
  onCreated?: (player: Player) => void;
};

export default function PlayerForm({ onDone, onCreated }: PlayerFormProps) {
  const { players, create } = usePlayers();

  const {
    formState: { errors, dirtyFields },
    getValues,
    setValue,
    handleSubmit,
    register,
  } = useForm<Player>();

  const onSave = async (player: Player) => {
    await create(player);
    onCreated?.call(null, player);
    onDone();
  };

  const handleNameChange = () => {
    if (!dirtyFields.slug) {
      const slug = slugify(getValues('name'));
      setValue('slug', slug);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-6 gap-4">
        <TextField
          className="col-span-6"
          label="Kennung"
          errorMsg={errors.slug?.message}
          {...register('slug', {
            required: 'Pflichtfeld',
            validate: {
              uniqueSlug: (slug) =>
                !players.some((p) => p.slug === slug) ||
                'Spieler mit dieser Kennung ist schon angelegt.',
            },
          })}
        />
        <TextField
          className="col-span-6"
          label="Name"
          autoFocus
          errorMsg={errors.name?.message}
          {...register('name', {
            required: 'Pflichtfeld',
            validate: {
              uniqueName: (name) =>
                !players.some((p) => p.name === name) ||
                'Spieler mit diesem Namen ist schon angelegt.',
            },
            onBlur: handleNameChange,
          })}
        />
        <TextField
          className="col-span-6"
          label="EMail"
          errorMsg={errors.email?.message}
          {...register('email', {
            required: 'Pflichtfeld',
            pattern: {
              value: emailRegEx,
              message: 'Keine korrekte Email-Adresse.',
            },
          })}
        />
        <div className="col-span-6 mt-4 flex justify-end gap-x-4">
          <Button onClick={onDone} type="button">
            Abbrechen
          </Button>
          <Button primary type="submit">
            Anlegen
          </Button>
        </div>
      </div>
    </form>
  );
}
