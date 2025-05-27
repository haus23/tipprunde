import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '~/database/types';

import { PenIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipTrigger } from '~/components/ui/tooltip';

export const actions = {
  onEditClick: (_user: User) => {},
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <TooltipTrigger>
          <Button
            onPress={() => {
              actions.onEditClick(user);
            }}
            iconOnly
          >
            <PenIcon className="size-5 text-app-11" />
          </Button>
          <Tooltip offset={6}>{`${user.name} bearbeiten`}</Tooltip>
        </TooltipTrigger>
      );
    },
  },
];
