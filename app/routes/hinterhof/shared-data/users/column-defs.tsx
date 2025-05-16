import type { ColumnDef } from '@tanstack/react-table';
import type { users } from '~/database/schema';

type User = typeof users.$inferSelect;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
