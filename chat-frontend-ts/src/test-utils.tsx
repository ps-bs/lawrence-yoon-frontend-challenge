import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles';

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react';
export { customRender as render }
