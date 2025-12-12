import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack
} from '@mui/material'
import { Wallet } from '../lib/api'

interface WalletFormProps {
  open: boolean
  wallet?: Wallet
  onClose: () => void
  onSave: (data: Omit<Wallet, 'id'>) => Promise<void>
}

const BROKERS = ['XP', 'Inter', 'NuInvest', 'Rico', 'Clear', 'BTG', 'Binance', 'Outra']
const COLORS = [
  { label: 'Preto', value: '#000000' },
  { label: 'Azul', value: '#0066CC' },
  { label: 'Verde', value: '#009963' },
  { label: 'Vermelho', value: '#E53935' },
  { label: 'Roxo', value: '#9C27B0' },
  { label: 'Laranja', value: '#FF9800' },
]

export default function WalletForm({ open, wallet, onClose, onSave }: WalletFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    broker: '',
    ownerName: '',
    color: '#000000'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        broker: wallet.broker,
        ownerName: wallet.ownerName,
        color: wallet.color
      })
    } else {
      setFormData({
        name: '',
        broker: '',
        ownerName: '',
        color: '#000000'
      })
    }
  }, [wallet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{wallet ? 'Editar Carteira' : 'Nova Carteira'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nome da Carteira (Apelido)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Corretora"
              value={formData.broker}
              onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
              fullWidth
              required
            >
              {BROKERS.map((broker) => (
                <MenuItem key={broker} value={broker}>{broker}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Titular (Pessoa)"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Cor de Identificação"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              fullWidth
            >
              {COLORS.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <div style={{ width: 20, height: 20, backgroundColor: color.value, borderRadius: '50%' }} />
                    <span>{color.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
