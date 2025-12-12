'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Typography
} from '@mui/material'
import { variableIncomeApi, walletApi, Wallet } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

interface VariableIncomeFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialWalletId?: number
  initialData?: any
}

export default function VariableIncomeForm({ onSuccess, onCancel, initialWalletId, initialData }: VariableIncomeFormProps) {
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const { showSuccess, showError } = useSnackbar()

  const [formData, setFormData] = useState({
    ticker: initialData?.ticker || '',
    type: initialData?.type || 'Ação',
    quantity: initialData?.quantity || '',
    averagePrice: initialData?.averagePrice || '',
    walletId: initialData?.walletId || initialWalletId || '',
  })

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await walletApi.getAll()
        setWallets(response.data)
      } catch (error) {
        console.error('Error fetching wallets', error)
      }
    }
    fetchWallets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        averagePrice: Number(formData.averagePrice),
        walletId: formData.walletId ? Number(formData.walletId) : null
      }

      if (initialData?.id) {
        // Edit flow usually not for Quantity/Price directly in PM logic but allowed here for correction
        // API update endpoint might be missing on VariableIncomeController? 
        // Logic check: VariableIncomeController has valid Update?
        // Checking controller... VariableIncomeController has Create, GetAll, AddTransaction. 
        // It DOES NOT have Update! 
        // Ideally we should add Update endpoint. For now creation/transaction is primary.
        showError('Edição direta não suportada. Use Transações.') // Placeholder until Update endpoint exists
        // Or if simple edit is needed, add PUT endpoint later.
        // For now let's assume creation.
      } else {
        await variableIncomeApi.create(payload)
        showSuccess('Ativo adicionado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      showError('Erro ao salvar ativo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Editar Ativo' : 'Novo Ativo de Renda Variável'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ticker"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
            required
            helperText="Ex: PETR4, VALE3, MXRF11"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              label="Tipo"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="Ação">Ação</MenuItem>
              <MenuItem value="FII">FII</MenuItem>
              <MenuItem value="ETF">ETF</MenuItem>
              <MenuItem value="BDR">BDR</MenuItem>
              <MenuItem value="Crypto">Criptomoeda</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            InputProps={{ inputProps: { min: 1, step: "1" } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Preço Médio"
            type="number"
            value={formData.averagePrice}
            onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
            required
            InputProps={{ inputProps: { min: 0, step: "0.01" } }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Carteira (Opcional)</InputLabel>
            <Select
              value={formData.walletId}
              label="Carteira (Opcional)"
              onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
            >
              <MenuItem value=""><em>Nenhuma</em></MenuItem>
              {wallets.map((wallet) => (
                <MenuItem key={wallet.id} value={wallet.id}>
                  {wallet.name} ({wallet.ownerName})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Salvar'}
        </Button>
      </Box>
    </Box>
  )
}
