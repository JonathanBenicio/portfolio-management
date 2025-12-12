'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light')

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setMode(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newMode)
      return newMode
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#009963',
            light: '#33AD7F',
            dark: '#006B45',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#0066CC',
            light: '#3385D6',
            dark: '#00478F',
            contrastText: '#FFFFFF',
          },
          ...(mode === 'dark'
            ? {
              background: {
                default: '#121212',
                paper: '#1E1E1E',
              },
              text: {
                primary: '#FFFFFF',
                secondary: '#B0B0B0',
              },
            }
            : {
              background: {
                default: '#F8F9FA',
                paper: '#FFFFFF',
              },
              text: {
                primary: '#000000',
                secondary: '#666666',
              },
            }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark'
                  ? '0 2px 8px rgba(0,0,0,0.5)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
