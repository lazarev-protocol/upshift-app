import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import useWithdraw from '@/hooks/use-withdraw';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';
import UpcomingRedemptionsMolecule from '../molecules/upcoming-redemptions';

export default function RedeemModalMolecule(props?: IPoolWithUnderlying) {
  const { handleWithdraw, isSuccess, button, expected, pool } = useWithdraw({
    asset: props?.asset,
    pool: props?.address,
    value: (props as any)?.redeemable?.normalized, // TODO: add type interface
    redemptions: (props as any)?.availableRedemptions,
  });

  return (
    <ModalAtom
      title="Redeem"
      buttonProps={{
        children: 'Redeem',
        variant: 'outlined',
        color: 'warning',
      }}
      closeWhen={isSuccess}
    >
      <Stack spacing={2} position="relative">
        <AssetInputMolecule
          address={props?.address}
          type="Out"
          value={(props as any)?.redeemable?.normalized}
        />
        <UpcomingRedemptionsMolecule
          redemptions={(props as any)?.availableRedemptions}
          loading={pool?.loading}
          asset={props?.symbol}
        />
        <TxFeesAtom
          function="claim"
          out={props?.underlying?.address}
          in={props?.address}
          fee={expected.fee.raw}
          loading={+expected.loading}
          pool={pool}
        />
        <Web3Button
          style={{ marginTop: '1rem' }}
          size="large"
          variant="contained"
          onClick={handleWithdraw}
          disabled={button.disabled || pool?.loading}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}