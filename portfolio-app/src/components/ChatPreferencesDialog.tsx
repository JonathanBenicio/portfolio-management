'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Divider
} from '@mui/material'
import { aiService } from '@/lib/aiService'

interface ChatPreferencesDialogProps {
  open: boolean
  onClose: () => void
}

export default function ChatPreferencesDialog({ open, onClose }: ChatPreferencesDialogProps) {
  const [model, setModel] = useState('')
  const [disableThinking, setDisableThinking] = useState(false)
  const currentProvider = aiService.getProvider()

  // Load current settings when dialog opens
  useEffect(() => {
    if (open) {
      // In a real app we might want to get these from aiService public getters
      // For now we manage state locally and push to service on save
    }
  }, [open])

  const handleSave = () => {
    if (model) {
      aiService.setModel(model)
    }
    aiService.setDisableThinking(disableThinking)
    onClose()
  }

  const getModelsForProvider = () => {
    if (currentProvider === 'Google') {
      return [
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Rápido & Econômico)' },
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Mais Inteligente)' },
        { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro (Standard)' }
      ]
    }
    return [
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Padrão)' },
      { value: 'gpt-4', label: 'GPT-4 (Avançado - Requer conta paga)' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Atualizado)' }
    ]
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Preferências do Chat</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

          <FormControl fullWidth>
            <InputLabel>Modelo ({currentProvider})</InputLabel>
            <Select
              value={model || (currentProvider === 'Google' ? 'gemini-1.5-flash' : 'gpt-3.5-turbo')}
              label={`Modelo (${currentProvider})`}
              onChange={(e) => setModel(e.target.value)}
            >
              {getModelsForProvider().map(m => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={disableThinking}
                  onChange={(e) => setDisableThinking(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  Modo Resposta Direta (Desativar Pensamento)
                </Typography>
              }
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Quando ativado, a IA será instruída a ser extremamente concisa e não explicar seu raciocínio.
              Útil para respostas rápidas.
            </Typography>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
