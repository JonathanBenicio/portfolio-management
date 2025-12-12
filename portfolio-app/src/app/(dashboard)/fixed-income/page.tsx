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
import { fixedIncomeApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

export default function FixedIncomePage() {
  const [filter, setFilter] = useState('Todos')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useSnackbar()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fixedIncomeApi.getAll()
      setAssets(response.data)
    } catch (error) {
      showError('Erro ao carregar ativos de renda fixa')
      // Mock data fallback
      setAssets([
        { id: 1, name: 'CDB Banco Inter', type: 'CDB', investedValue: 50000, currentValue: 52500, interestRate: 105, index: 'CDI', maturityDate: '2025-06-15' },
        { id: 2, name: 'Tesouro Selic 2027', type: 'Tesouro', investedValue: 30000, currentValue: 31200, interestRate: 100, index: 'Selic', maturityDate: '2027-03-01' },
        { id: 3, name: 'LCI Banco XP', type: 'LCI', investedValue: 20000, currentValue: 20800, interestRate: 95, index: 'CDI', maturityDate: '2025-12-31' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fixedIncomeApi.delete(id)
      showSuccess('Ativo removido com sucesso!')
      fetchAssets()
    } catch (error) {
      showError('Erro ao remover ativo')
    }
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
          <Button variant="contained" startIcon={<AddIcon />}>
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
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(asset.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
