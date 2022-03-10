import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/ui/atoms/Button';
import FormPanel from '@/ui/FormPanel';
import TextField from '@/ui/atoms/TextField';
import ModalDialog from '@/ui/ModalDialog';
import LeagueForm from './LeagueForm';
import { League } from '@/api/model/league';
import { useNotify } from '@/core/hooks/use-notify';
import { useLeagues } from '@/api/hooks/use-leagues';
import ComboboxField from '@/ui/atoms/ComboboxField';

export type MatchFormType = {
  date: string;
  league: League;
  firstTeam: string;
  secondTeam: string;
};

function MatchForm() {
  const { leagues, create: createLeague } = useLeagues();
  const { control, register, handleSubmit } = useForm<MatchFormType>({
    defaultValues: { league: leagues && leagues[0] },
  });

  const notify = useNotify();

  const [leagueDialogOpen, setLeagueDialogOpen] = useState(false);
  const [leagueError, setLeagueError] = useState('');

  const onSubmit: SubmitHandler<MatchFormType> = async (data) => {
    // Hack: no clue how to handle errors on object type fields
    if (typeof data.league == 'undefined') {
      setLeagueError('Liga muss schon ausgewählt werden.');
    } else {
      setLeagueError('');
    }
    // onAddMatch(data);
    console.log(data);
  };

  const onAddLeague = (league: League) => {
    setLeagueDialogOpen(false);
    notify(createLeague(league), `Neue Liga${league.name}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormPanel className="grid grid-cols-6 gap-4">
          <TextField
            className="col-span-4 sm:col-span-2 md:col-span-4 lg:col-span-2"
            type="date"
            label="Datum"
            lang="de"
            {...register('date')}
          />
          <Controller
            control={control}
            name="league"
            render={({ field: { onChange, value } }) => (
              <ComboboxField
                className="col-span-4 sm:col-span-3 sm:col-start-4 md:col-span-4 lg:col-span-3 lg:col-start-4"
                label="Liga / Runde / Gruppe / Wettbewerb"
                items={leagues}
                displayField="name"
                filter={(query, league) =>
                  league.name.toLowerCase().includes(query.toLowerCase())
                }
                onChange={onChange}
                currentItem={value}
                errorMsg={leagueError}
              />
            )}
          />
          <TextField
            className="col-span-6 lg:col-span-4"
            label="Wer?"
            {...register('firstTeam')}
          />
          <TextField
            className="col-span-6 lg:col-span-4"
            label="Gegen wen?"
            {...register('secondTeam')}
          />
          <div className="col-span-6 mt-4 flex justify-end">
            <Button primary className="w-32" type="submit">
              Speichern
            </Button>
          </div>
        </FormPanel>
      </form>
      <ModalDialog
        open={leagueDialogOpen}
        onClose={() => setLeagueDialogOpen(false)}
      >
        <LeagueForm
          onSave={onAddLeague}
          onCancel={() => setLeagueDialogOpen(false)}
        />
      </ModalDialog>
    </>
  );
}

export default MatchForm;
