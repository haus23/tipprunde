import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '~/database/types';

import { CheckIcon, PenIcon } from 'lucide-react';

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
    cell: ({ row }) => (
      <div className="w-32 truncate sm:w-auto">{row.original.email}</div>
    ),
  },
  {
    accessorKey: 'roles',
    header: () => (
      <div className="flex justify-center">
        <span className="hidden sm:block">Administrator</span>
        <span className="sm:hidden">Admin</span>
      </div>
    ),
    cell: ({ row }) =>
      row.original.roles.includes('ADMIN') ? (
        <div className="flex justify-center">
          <CheckIcon />
        </div>
      ) : (
        ''
      ),
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
            className="translate-x-2"
          >
            <PenIcon className="size-5 text-app-11" />
          </Button>
          <Tooltip offset={6}>{`${user.name} bearbeiten`}</Tooltip>
        </TooltipTrigger>
      );
    },
  },
];
