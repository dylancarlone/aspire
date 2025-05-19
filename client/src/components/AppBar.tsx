import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import logo from '../assets/logo.svg';

type AppBarProps = {
  onUpdateRepositoryLatestReleases: () => Promise<void>;
  onResetRepositoryLatestReleases: () => Promise<void>;
};

function AppBar({
  onUpdateRepositoryLatestReleases,
  onResetRepositoryLatestReleases,
}: AppBarProps) {
  return (
    <MuiAppBar position="static" color="secondary" elevation={0}>
      <Toolbar>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            src={logo}
            className="logo"
            alt="Aspire logo"
            sx={{ mr: 2 }}
            component="img"
          />
          <Typography variant="h5">GitHub Repository Tracker</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={onUpdateRepositoryLatestReleases}
            >
              Refresh Releases
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onResetRepositoryLatestReleases}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;
