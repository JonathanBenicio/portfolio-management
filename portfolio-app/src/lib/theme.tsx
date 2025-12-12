'use client'

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ptBR } from '@mui/material/locale'
import { designSystemApi } from '@/lib/api'

type ThemeMode = 'light' | 'dark'

export interface DesignSystemConfig {
  primaryMain: string
  primaryLight: string
  primaryDark: string
  secondaryMain: string
  secondaryLight: string
  secondaryDark: string
  fontFamily: string
  h1FontSize: number
  h2FontSize: number
  h3FontSize: number
  h4FontSize: number
  h5FontSize: number
  h6FontSize: number
  bodyFontSize: number
  spacingUnit: number
  borderRadius: number
}

const DEFAULT_CONFIG: DesignSystemConfig = {
  primaryMain: '#009963',
  primaryLight: '#33AD7F',
  primaryDark: '#006B45',
  secondaryMain: '#0066CC',
  secondaryLight: '#3385D6',
  secondaryDark: '#00478F',
  fontFamily: 'Inter, Roboto, sans-serif',
  h1FontSize: 96,
  h2FontSize: 60,
  h3FontSize: 48,
  h4FontSize: 34,
  h5FontSize: 24,
  h6FontSize: 20,
  bodyFontSize: 16,
  spacingUnit: 8,
  borderRadius: 8,
}

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  config: DesignSystemConfig
  setConfig: (config: DesignSystemConfig) => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => { },
  config: DEFAULT_CONFIG,
  setConfig: () => { },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [config, setConfig] = useState<DesignSystemConfig>(DEFAULT_CONFIG)

  // Handle hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load theme mode from local storage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode
    if (savedMode) {
      setMode(savedMode)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Fetch design system config from backend
  useEffect(() => {
    // Only fetch if token exists to avoid 401 redirect loops
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchConfig = async () => {
      try {
        const response = await designSystemApi.getConfig()
        if (response.data) {
          setConfig(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch design system config, using default', error)
      }
    }
    fetchConfig()
  }, [])



  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('themeMode', newMode)
  }

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode,
            primary: {
              main: config.primaryMain,
              light: config.primaryLight,
              dark: config.primaryDark,
              contrastText: '#ffffff',
            },
            secondary: {
              main: config.secondaryMain,
              light: config.secondaryLight,
              dark: config.secondaryDark,
              contrastText: '#ffffff',
            },
            background: {
              default: mode === 'light' ? '#F8F9FA' : '#121212',
              paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            },
          },
          typography: {
            fontFamily: config.fontFamily,
            h1: { fontSize: config.h1FontSize, fontWeight: 700 },
            h2: { fontSize: config.h2FontSize, fontWeight: 700 },
            h3: { fontSize: config.h3FontSize, fontWeight: 600 },
            h4: { fontSize: config.h4FontSize, fontWeight: 600 },
            h5: { fontSize: config.h5FontSize, fontWeight: 500 },
            h6: { fontSize: config.h6FontSize, fontWeight: 500 },
            body1: { fontSize: config.bodyFontSize },
            button: { textTransform: 'none', fontWeight: 600 },
          },
          spacing: config.spacingUnit,
          shape: {
            borderRadius: config.borderRadius,
          },
          components: {
            MuiPaper: {
              styleOverrides: {
                root: {
                  backgroundImage: 'none',
                },
              },
            },
            MuiButton: {
              styleOverrides: {
                root: {
                  borderRadius: config.borderRadius,
                  padding: '8px 16px',
                },
                containedPrimary: {
                  '&:hover': {
                    backgroundColor: mode === 'light' ? config.primaryDark : config.primaryLight,
                  },
                },
              },
            },
            MuiCard: {
              styleOverrides: {
                root: {
                  borderRadius: config.borderRadius * 2,
                  boxShadow: mode === 'light'
                    ? '0px 2px 4px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.05)'
                    : '0px 2px 4px rgba(0,0,0,0.2), 0px 4px 6px rgba(0,0,0,0.2)',
                },
              },
            },
          },
        },
        ptBR
      ),
    [mode, config]
  )

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, config, setConfig }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
