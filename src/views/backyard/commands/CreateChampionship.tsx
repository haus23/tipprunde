import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Championship } from '@/api/model/championship';
import { useChampionships } from '@/api/hooks/use-championships';
import { useCurrentChampionship } from '@/views/backyard/hooks/use-current-championship';
import BackyardContent from '@/layouts/components/BackyardContent';
import FormPanel from '@/components/FormPanel';
import TextField from '@/components/atoms/TextField';
import Button from '@/components/atoms/Button';

export default function CreateChampionship() {
  const { championships, create } = useChampionships();
  const { setChampionship } = useCurrentChampionship();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<Championship>({
    defaultValues: { id: '' },
  });

  const handleTitleChange = () => {
    if (!dirtyFields.id) {
      const name = getValues('title');
      const stdPattern = /^([HRWE]).*(\d{2})\/?(\d{2})$/;
      const match = name.match(stdPattern);
      if (match) {
        const secondLetter = match[0].match(/[HR]/) ? 'r' : 'm';
        setValue(
          'id',
          `${match[1].toLowerCase() + secondLetter}${match[2] + match[3]}`
        );
      }
    }
  };

  const onSubmit: SubmitHandler<Championship> = async ({ id, title, nr }) => {
    const championship: Championship = {
      id,
      title,
      nr,
      published: false,
      completed: false,
    };
    await create(championship);
    setChampionship(championship);
    navigate('../turnier');
  };

  return (
    <BackyardContent title="Neues Turnier">
      <FormPanel className="max-w-2xl">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              label="Kennung"
              placeholder="Eindeutige Kennung"
              errorMsg={errors.id?.message}
              {...register('id', {
                required: 'Pflichtfeld',
                pattern: {
                  value: /[a-z]{2}[0-9]{4}/,
                  message:
                    'Genau sechs Zeichen - zwei Kleinbuchstaben und dann vier Ziffern',
                },
                maxLength: {
                  value: 6,
                  message:
                    'Genau sechs Zeichen - zwei Kleinbuchstaben und dann vier Ziffern',
                },
                validate: {
                  uniqueSlug: (id) =>
                    !championships.some((c) => c.id === id) ||
                    'Turnier mit dieser Kennung existiert schon',
                },
              })}
            />
          </div>
          <div>
            <TextField
              autoFocus
              label="Titel"
              errorMsg={errors.title?.message}
              {...register('title', {
                required: 'Pflichtfeld',
                onBlur: handleTitleChange,
              })}
            />
          </div>
          <div>
            <TextField
              label="Nummer"
              type="number"
              errorMsg={errors.nr?.message}
              {...register('nr', {
                required: 'Pflichtfeld',
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="flex justify-end">
            <Button primary className="w-32" type="submit">
              Anlegen
            </Button>
          </div>
        </form>
      </FormPanel>
    </BackyardContent>
  );
}
