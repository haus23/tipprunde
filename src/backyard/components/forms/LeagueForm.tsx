import { useForm } from 'react-hook-form';

import { League } from '@/api/model/league';
import { useLeagues } from '@/api/hooks/use-leagues';

import Button from '@/ui/atoms/Button';
import TextField from '@/ui/atoms/TextField';

type LeagueFormProps = {
  onSave: (league: League) => void;
  onCancel: () => void;
};

function LeagueForm({ onSave, onCancel }: LeagueFormProps) {
  const { leagues } = useLeagues();

  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm<League>();

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6">
          <h3 className="text-lg">Neue Liga</h3>
        </div>
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
          <Button onClick={onCancel} type="button">
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

export default LeagueForm;
