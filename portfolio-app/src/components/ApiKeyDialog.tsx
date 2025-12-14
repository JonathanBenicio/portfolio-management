'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { apiKeyApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

interface ApiKeyDialogProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function ApiKeyDialog({ open, onClose, onSaved }: ApiKeyDialogProps) {
  const [provider, setProvider] = useState('OpenAI')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const { showSuccess, showError } = useSnackbar()

  const handleSave = async () => {
    if (!apiKey.trim()) {
      showError('Por favor, insira uma API key válida')
      return
    }

    setLoading(true)
    try {
      await apiKeyApi.save({ provider, apiKey })
      showSuccess('API key salva com sucesso!')
      setApiKey('')
      onSaved()
      onClose()
    } catch (error) {
      showError('Erro ao salvar API key')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setApiKey('')
    setShowKey(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar API Key</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Sua API key será armazenada de forma segura e criptografada.
            Ela será usada apenas para fazer chamadas à IA em seu nome.
          </Alert>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Provedor</InputLabel>
            <Select
              value={provider}
              label="Provedor"
              onChange={(e) => setProvider(e.target.value)}
            >
              <MenuItem value="OpenAI">OpenAI (ChatGPT)</MenuItem>
              <MenuItem value="Google">Google (Gemini)</MenuItem>
              <MenuItem value="Anthropic" disabled>Anthropic (Claude) - Em breve</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="API Key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={provider === 'Google' ? 'AIza...' : 'sk-...'}
            helperText={
              provider === 'OpenAI'
                ? 'Obtenha sua chave em: https://platform.openai.com/api-keys'
                : provider === 'Google'
                  ? 'Obtenha sua chave em: https://aistudio.google.com/app/apikey'
                  : 'Digite sua API key'
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowKey(!showKey)}
                    edge="end"
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            💡 Dica: Mantenha sua API key em segredo e nunca a compartilhe.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !apiKey.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
