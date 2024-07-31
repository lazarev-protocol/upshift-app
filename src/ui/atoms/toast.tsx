import type { IChainId } from '@augustdigital/sdk';
import { explorerLink, truncate } from '@augustdigital/sdk';
import { Typography } from '@mui/material';
import LinkAtom from './anchor-link';

type IToast = {
  type?: 'tx';
  hash?: `0x${string}`;
  msg: string;
  chain?: IChainId;
};

export default function Toast({ hash, msg, chain = 42161 }: IToast) {
  if (hash) {
    return (
      <Typography>
        {msg}{' '}
        <LinkAtom href={explorerLink(hash, chain, 'tx')}>
          {truncate(hash)}
        </LinkAtom>
      </Typography>
    );
  }
  return <Typography>{msg}</Typography>;
}
