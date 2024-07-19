import { useThemeMode } from '@/stores/theme';
import { FALLBACK_TOKEN_IMG, STYLE_VARS } from '@/utils/constants';
import type { IAssetDisplay } from '@/utils/types';
import { getSymbol } from '@augustdigital/sdk';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

type IAssetSelector = IAssetDisplay & {
  forInput?: boolean;
};

export default function AssetSelectorAtom(props: IAssetSelector) {
  const { isDark } = useThemeMode();
  const [symbol, setSymbol] = useState<string | undefined>(props.address);
  const provider = usePublicClient();

  useEffect(() => {
    (async () => {
      if (!(provider && props.address)) return;
      console.log('Provider:', provider);
      console.log('Address:', props?.address);
      const tokenSymbol = await getSymbol(provider as any, props?.address);
      console.log('tokenSymbol:', tokenSymbol);
      if (tokenSymbol) setSymbol(tokenSymbol);
    })().catch(console.error);
  }, [props?.address]);

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={1}
      padding={'0 0.5rem'}
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
        borderTopLeftRadius: props.forInput ? '0px' : undefined,
        borderBottomLeftRadius: props.forInput ? '0px' : undefined,
        borderTopRightRadius: props.forInput ? '4px' : undefined,
        borderBottomRightRadius: props.forInput ? '4px' : undefined,
      }}
    >
      <Image
        src={props?.img ?? FALLBACK_TOKEN_IMG}
        alt={props?.symbol ?? 'etherscan generic token'}
        height={24}
        width={24}
      />
      <Box width={STYLE_VARS.assetDivWidth}>
        <Typography variant="body1" noWrap>
          {symbol ?? 'N/A'}
        </Typography>
      </Box>
    </Stack>
  );
}
