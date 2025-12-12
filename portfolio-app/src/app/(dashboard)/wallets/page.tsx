'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Stack,
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { walletApi, Wallet } from '../../../lib/api'
import WalletForm from '../../../components/WalletForm'
import { useSnackbar } from '../../../lib/snackbar'

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [editingWallet, setEditingWallet] = useState<Wallet | undefined>(undefined)
  const { showSuccess, showError } = useSnackbar()
  const theme = useTheme()

  const fetchWallets = async () => {
    try {
      const response = await walletApi.getAll()
      setWallets(response.data)
    } catch (error) {
      showError('Erro ao carregar carteiras')
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const handleCreate = () => {
    setEditingWallet(undefined)
    setOpenForm(true)
  }

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet)
    setOpenForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta carteira?')) {
      try {
        await walletApi.delete(id)
        showSuccess('Carteira excluída com sucesso')
        fetchWallets()
      } catch (error) {
        showError('Erro ao excluir carteira')
      }
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (editingWallet) {
        await walletApi.update(editingWallet.id, data)
        showSuccess('Carteira atualizada com sucesso')
      } else {
        await walletApi.create(data)
        showSuccess('Carteira criada com sucesso')
      }
      fetchWallets()
    } catch (error) {
      showError('Erro ao salvar carteira')
      throw error
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Minhas Carteiras
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nova Carteira
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet.id}>
            <Card
              sx={{
                height: '100%',
                borderTop: `4px solid ${wallet.color}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: `${wallet.color}20`,
                      color: wallet.color
                    }}
                  >
                    <WalletIcon />
                  </Box>
                  <Chip label={wallet.broker} size="small" />
                </Stack>

                <Typography variant="h6" gutterBottom>
                  {wallet.name}
                </Typography>

                <Typography color="text.secondary" variant="body2">
                  Titular: {wallet.ownerName}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleEdit(wallet)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(wallet.id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {wallets.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography variant="h6">Nenhuma carteira encontrada</Typography>
              <Typography variant="body2">Crie sua primeira carteira para organizar seus investimentos.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <WalletForm
        open={openForm}
        wallet={editingWallet}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
      />
    </Box>
  )
}
