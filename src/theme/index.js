import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { viVN } from '@mui/material/locale';
// @mui
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';


// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const themeOptions = useMemo(() => ({
      palette,
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
  }),[]);

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);
  const theme2 = createTheme(theme,viVN); 
  

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme2}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
