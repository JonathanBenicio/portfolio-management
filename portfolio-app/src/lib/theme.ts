'use client'

import { createTheme } from '@mui/material/styles'
import { Roboto } from 'next/font/google'
import { useState } from 'react'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

// Map theme.css variables to MUI theme
// Note: In a real implementation we might want to read these dynamically or just hardcode the match
const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(161, 93%, 30%)', // --primary
      contrastText: 'hsl(151, 80%, 95%)', // --primary-foreground
    },
    background: {
      default: 'hsl(0, 0%, 96%)', // --background
      paper: 'hsl(0, 0%, 98%)', // --card
    },
    error: {
      main: 'hsl(0, 72%, 50%)', // --destructive
    },
    text: {
      primary: 'hsl(0, 0%, 9%)', // --foreground
      secondary: 'hsl(0, 0%, 45%)', // --muted
    },
  },
  shape: {
    borderRadius: 16, // --radius
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)', // --shadow
          borderRadius: '1rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
        },
      },
    },
  },
})

export default theme

export interface DesignSystemConfig {
    primaryLight: string;
    primaryMain: string;
    primaryDark: string;
    secondaryLight: string;
    secondaryMain: string;
    secondaryDark: string;
    fontFamily: string;
    h1FontSize: number;
    h2FontSize: number;
    h3FontSize: number;
    bodyFontSize: number;
    spacingUnit: number;
    borderRadius: number;
}

export const useTheme = () => {
    const [config, setConfig] = useState<DesignSystemConfig>({
        primaryLight: '#4caf50',
        primaryMain: '#2e7d32',
        primaryDark: '#1b5e20',
        secondaryLight: '#42a5f5',
        secondaryMain: '#1976d2',
        secondaryDark: '#1565c0',
        fontFamily: 'Roboto, sans-serif',
        h1FontSize: 32,
        h2FontSize: 24,
        h3FontSize: 20,
        bodyFontSize: 16,
        spacingUnit: 8,
        borderRadius: 4
    });

    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { config, setConfig, mode, toggleTheme };
}
