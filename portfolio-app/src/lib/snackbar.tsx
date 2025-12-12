'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface SnackbarContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (msg: string, sev: 'success' | 'error' | 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  const showSuccess = (msg: string) => showMessage(msg, 'success')
  const showError = (msg: string) => showMessage(msg, 'error')
  const showInfo = (msg: string) => showMessage(msg, 'info')

  const handleClose = () => setOpen(false)

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}
