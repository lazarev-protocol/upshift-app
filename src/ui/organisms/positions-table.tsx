import type { IColumn } from '@/utils/types';
import { Box, Chip, TableCell, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';
import { renderVariant } from '@/utils/helpers/ui';
import TableMolecule from '../molecules/table';
import PoolActionsMolecule from './pool-actions';

const columns: readonly IColumn[] = [
  { id: 'token', value: 'Token', minWidth: 150 },
  {
    id: 'status',
    value: 'Status',
    minWidth: 150,
    component: ({
      children: {
        props: { children },
      },
    }: any) => (
      <TableCell>
        <Chip
          label={String(children)}
          color={renderVariant(children)}
          variant="outlined"
        />
      </TableCell>
    ),
  },
  { id: 'position', value: 'Position', align: 'right', minWidth: 150 },
  {
    id: 'apy',
    value: 'Net APY',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'walletBalance',
    value: 'Supplied',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'redeemable',
    value: 'Redeemable',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

export default function MyPositionsTableOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data?: any;
  loading?: number;
}) {
  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
    enabled: typeof data === 'undefined' && !loading,
  }) as UseQueryResult<any>;

  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={1}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data ?? positions}
        uidKey="address"
        loading={loading ?? +positionsLoading}
        action={(rowData: any) => PoolActionsMolecule({ pool: rowData })}
        pagination={false}
      />
    </Box>
  );
}
