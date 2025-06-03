import type { ColumnDef } from '@tanstack/react-table';
import type { Team } from '~/database/types';

import { PenIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipTrigger } from '~/components/ui/tooltip';

export const actions = {
  onEditClick: (_team: Team) => {},
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'shortname',
    header: 'Kurzname',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const team = row.original;
      return (
        <TooltipTrigger>
          <Button
            onPress={() => {
              actions.onEditClick(team);
            }}
            iconOnly
          >
            <PenIcon className="size-5 text-app-11" />
          </Button>
          <Tooltip offset={6}>{`${team.shortname} bearbeiten`}</Tooltip>
        </TooltipTrigger>
      );
    },
  },
];
