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
import { fixedIncomeApi, walletApi, Wallet } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

interface FixedIncomeFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialWalletId?: number
  initialData?: any
}

export default function FixedIncomeForm({ onSuccess, onCancel, initialWalletId, initialData }: FixedIncomeFormProps) {
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const { showSuccess, showError } = useSnackbar()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'CDB',
    investedValue: initialData?.investedValue || '',
    interestRate: initialData?.interestRate || '',
    index: initialData?.index || 'CDI',
    purchaseDate: initialData?.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    maturityDate: initialData?.maturityDate ? new Date(initialData.maturityDate).toISOString().split('T')[0] : '',
    liquidity: initialData?.liquidity || 'Vencimento',
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
        investedValue: Number(formData.investedValue),
        interestRate: Number(formData.interestRate),
        walletId: formData.walletId ? Number(formData.walletId) : null
      }

      if (initialData?.id) {
        await fixedIncomeApi.update(initialData.id, payload)
        showSuccess('Ativo atualizado com sucesso!')
      } else {
        await fixedIncomeApi.create(payload)
        showSuccess('Ativo criado com sucesso!')
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
        {initialData ? 'Editar Ativo' : 'Novo Ativo de Renda Fixa'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
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
              <MenuItem value="CDB">CDB</MenuItem>
              <MenuItem value="LCI">LCI</MenuItem>
              <MenuItem value="LCA">LCA</MenuItem>
              <MenuItem value="Tesouro">Tesouro Direto</MenuItem>
              <MenuItem value="Debêntures">Debêntures</MenuItem>
              <MenuItem value="CRI">CRI</MenuItem>
              <MenuItem value="CRA">CRA</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Valor Investido"
            type="number"
            value={formData.investedValue}
            onChange={(e) => setFormData({ ...formData, investedValue: e.target.value })}
            required
            InputProps={{ inputProps: { min: 0, step: "0.01" } }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Taxa"
            type="number"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth required>
            <InputLabel>Indexador</InputLabel>
            <Select
              value={formData.index}
              label="Indexador"
              onChange={(e) => setFormData({ ...formData, index: e.target.value })}
            >
              <MenuItem value="CDI">% do CDI</MenuItem>
              <MenuItem value="IPCA">IPCA +</MenuItem>
              <MenuItem value="Pré">Pré-fixado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Data de Compra"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vencimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.maturityDate}
            onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Liquidez</InputLabel>
            <Select
              value={formData.liquidity}
              label="Liquidez"
              onChange={(e) => setFormData({ ...formData, liquidity: e.target.value })}
            >
              <MenuItem value="Diário">Diário</MenuItem>
              <MenuItem value="Vencimento">Vencimento</MenuItem>
            </Select>
          </FormControl>
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
