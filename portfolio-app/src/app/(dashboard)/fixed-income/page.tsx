'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { fixedIncomeApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'
import FixedIncomeForm from '@/components/FixedIncomeForm'

export default function FixedIncomePage() {
  const [filter, setFilter] = useState('Todos')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useSnackbar()
  const [openForm, setOpenForm] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fixedIncomeApi.getAll()
      setAssets(response.data)
    } catch (error) {
      showError('Erro ao carregar ativos de renda fixa')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este ativo?')) return
    try {
      await fixedIncomeApi.delete(id)
      showSuccess('Ativo removido com sucesso!')
      fetchAssets()
    } catch (error) {
      showError('Erro ao remover ativo')
    }
  }

  const handleEdit = (asset: any) => {
    setSelectedAsset(asset)
    setOpenForm(true)
  }

  const handleAdd = () => {
    setSelectedAsset(null)
    setOpenForm(true)
  }

  const handleFormSuccess = () => {
    setOpenForm(false)
    fetchAssets()
  }

  const getTypeColor = (type: string) => {
    const colors: any = {
      'CDB': 'primary',
      'Tesouro': 'success',
      'LCI': 'info',
      'LCA': 'warning',
      'Debêntures': 'secondary'
    }
    return colors[type] || 'default'
  }

  const totalInvested = assets.reduce((sum, a) => sum + (a.investedValue || 0), 0)
  const totalCurrent = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0)
  const profitability = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Renda Fixa
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Adicionar Ativo
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Total Investido</Typography>
          <Typography variant="h5" fontWeight="bold">
            R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Valor Atual</Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            R$ {totalCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Rentabilidade</Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            +{profitability.toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Taxa Média</Typography>
          <Typography variant="h5" fontWeight="bold">100% CDI</Typography> 
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Ativo</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Tipo de Ativo">
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="CDB">CDB</MenuItem>
                <MenuItem value="Tesouro">Tesouro</MenuItem>
                <MenuItem value="LCI">LCI</MenuItem>
                <MenuItem value="LCA">LCA</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell align="right"><strong>Investido</strong></TableCell>
                  <TableCell align="right"><strong>Valor Atual</strong></TableCell>
                  <TableCell align="right"><strong>Taxa</strong></TableCell>
                  <TableCell align="center"><strong>Vencimento</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.filter(a => filter === 'Todos' || a.type === filter).map((asset) => (
                  <TableRow key={asset.id} hover>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Chip label={asset.type} color={getTypeColor(asset.type)} size="small" />
                    </TableCell>
                    <TableCell align="right">R$ {asset.investedValue?.toLocaleString('pt-BR')}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      R$ {asset.currentValue?.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell align="right">{asset.interestRate}% {asset.index}</TableCell>
                    <TableCell align="center">{new Date(asset.maturityDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(asset)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(asset.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {assets.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={7} align="center">Nenhum ativo encontrado.</TableCell>
                     </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <FixedIncomeForm 
            onSuccess={handleFormSuccess} 
            onCancel={() => setOpenForm(false)}
            initialData={selectedAsset}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
