import { createTheme, experimental_sx as sx } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

export const theme = createTheme({
  spacing: [0, 8, 16, 24, 32, 40, 48, 56, 80],
  palette: {
    primary: {
      main: '#007d8c',
    },
    success: {
      main: '#3dad0e',
    },
    info: {
      main: '#063347',
    },
    secondary: {
      light: '#e4e4e4',
      main: '#686868',
      dark: '#303030',
      contrastText: '#000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: sx({
          textTransform: 'inherit',
          px: 3,
          py: 1,
        }),
      },
    },
  }
});

export const useStylesGlobal = makeStyles(() =>
  createStyles({
    '@global': {
      body: {
        fontFamily: 'Nunito Sans',
      },
      h1: {
        fontWeight: 800,  // Extra Bold
        fontSize: '24px',
        lineHeight: '32px',
      },
      h2: {
        fontWeight: 600,  // Semi Bold
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.2px',
      },
      textLarge1: {
        fontWeight: 400,  // Regular
        fontSize: '18px',
        lineHeight: '26px',
        letterSpacing: '0.15px',
      },
      textLarge2: {
        fontWeight: 700,  // Bold
        fontSize: '18px',
        lineHeight: '20px',
        letterSpacing: '0.13px',
      },
      boxShadowSmall: {
        boxShadow: '0 1 3 0 rgba(89, 89, 89, 0.23)',
      },
    },
  }),
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const GlobalStyle = () => {
  useStylesGlobal();
  return null;
};
