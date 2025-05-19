import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e3f1bb',
    },
    secondary: {
      main: '#18282d',
    },
    background: {
      default: '#f2f7f4',
    },
  },
  typography: {
    fontFamily: 'Inter Variable font, sans-serif',
    h5: {
      fontFamily: 'Raleway, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
