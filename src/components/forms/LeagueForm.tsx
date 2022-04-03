import { useForm } from 'react-hook-form';
import { League } from '@/api/model/league';
import { useLeagues } from '@/api/hooks/use-leagues';

import TextField from '../atoms/TextField';
import Button from '@/components/atoms/Button';

type LeagueFormProps = {
  onDone: () => void;
  onCreated?: (league: League) => void;
};

export default function LeagueForm({ onDone, onCreated }: LeagueFormProps) {
  const { leagues, create } = useLeagues();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<League>();

  const onSave = async (league: League) => {
    await create(league);
    onCreated?.call(null, league);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-6 gap-4">
        <TextField
          className="col-span-6"
          label="Bezeichnung"
          errorMsg={errors.name?.message}
          {...register('name', {
            required: 'Pflichtfeld',
            validate: {
              uniqueName: (name) =>
                !leagues.some((c) => c.name === name) ||
                'Liga mit diesem Namen ist schon angelegt.',
            },
          })}
        />
        <TextField
          className="col-span-6"
          label="Kurzform"
          errorMsg={errors.shortName?.message}
          {...register('shortName', {
            required: 'Pflichtfeld',
            validate: {
              uniqueShortname: (shortName) =>
                !leagues.some((c) => c.shortName === shortName) ||
                'Diese Kurzbezeichnung gibt es schon.',
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
