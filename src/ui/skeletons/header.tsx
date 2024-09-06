import dynamic from 'next/dynamic';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import appConfig from '@/config/app';
import { STYLE_VARS } from '@/utils/constants/ui';
import { useThemeMode } from '@/stores/theme';
import ThemeSwitch from '../atoms/theme-switch';
import LinkAtom from '../atoms/anchor-link';

const DynamicWalletBtn = dynamic(() => import('../molecules/connect-wallet'), {
  ssr: false,
});

const DynamicChainBtn = dynamic(() => import('../molecules/chain-dropdown'), {
  ssr: false,
});

const HeaderSkeleton = () => {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <header>
      <Box sx={{ flexGrow: 1, mb: '1rem' }}>
        <AppBar
          position="static"
          color={'inherit'}
          style={{
            backgroundColor: 'inherit',
            backgroundImage: 'none',
          }}
          sx={{ boxShadow: 'none', py: '0.25rem' }}
        >
          <Toolbar
            style={{
              maxWidth: STYLE_VARS.widthWide,
              margin: '0 auto',
              width: '100%',
            }}
          >
            {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              <LinkAtom
                href="/"
                target="_self"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span style={{ fontSize: '24px' }}>{appConfig.site_name}</span>
              </LinkAtom>
            </Typography>
            <Stack direction="row" alignItems="center" gap={{ xs: 1, md: 2 }}>
              <ThemeSwitch checked={isDark} onChange={toggleTheme} />
              <DynamicChainBtn />
              <DynamicWalletBtn />
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default HeaderSkeleton;
