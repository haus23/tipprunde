import { useForm } from 'react-hook-form';

import TextField from '../atoms/TextField';
import Button from '@/components/atoms/Button';
import { Team } from '@/api/model/team';
import { useTeams } from '@/api/hooks/use-teams';

type TeamFormProps = {
  onDone: () => void;
  onCreated?: (team: Team) => void;
};

export default function TeamForm({ onDone, onCreated }: TeamFormProps) {
  const { teams, create } = useTeams();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Team>();

  const onSave = async (team: Team) => {
    team = await create(team);
    onCreated?.call(null, team);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-6 gap-4">
        <TextField
          className="col-span-6"
          label="Mannschaft"
          errorMsg={errors.name?.message}
          {...register('name', {
            required: 'Pflichtfeld',
            validate: {
              uniqueName: (name) =>
                !teams.some((c) => c.name === name) ||
                'Mannschaft mit diesem Namen ist schon angelegt.',
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
                !teams.some((c) => c.shortName === shortName) ||
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
