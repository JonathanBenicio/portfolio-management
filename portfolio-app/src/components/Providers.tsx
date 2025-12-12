'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@/lib/theme.tsx'
import { AuthProvider } from '@/lib/auth'
import { SnackbarProvider } from '@/lib/snackbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider>
        <CssBaseline />
        <SnackbarProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
