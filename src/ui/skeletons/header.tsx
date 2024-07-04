import dynamic from 'next/dynamic';
import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import appConfig from '@/config/app';
import { STYLE_VARS } from '@/utils/constants';
import { useThemeMode } from '@/stores/theme';
import Button from '@mui/material/Button';
import ThemeSwitch from '../atoms/theme-switch';

const DynamicWalletBtn = dynamic(() => import('../molecules/connect-wallet'), {
  loading: () => <Button variant="outlined">Loading</Button>,
});

const HeaderSkeleton = () => {
  const { isDark, toggleTheme } = useThemeMode();
  return (
    <header>
      <Box sx={{ flexGrow: 1, mb: '1rem' }}>
        <AppBar
          position="static"
          color="inherit"
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
              <Link
                href="/"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {appConfig.site_name}
              </Link>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ThemeSwitch checked={isDark} onChange={toggleTheme} />
              <DynamicWalletBtn />
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default HeaderSkeleton;