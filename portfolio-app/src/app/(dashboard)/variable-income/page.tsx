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
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { variableIncomeApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'
import VariableIncomeForm from '@/components/VariableIncomeForm'

export default function VariableIncomePage() {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showError, showSuccess } = useSnackbar()
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await variableIncomeApi.getAll()
      setStocks(response.data)
    } catch (error) {
      showError('Erro ao carregar renda variável')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setOpenForm(false)
    fetchAssets()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  const totalInvested = stocks.reduce((sum, s) => sum + (s.quantity * s.averagePrice), 0)
  const currentValue = stocks.reduce((sum, s) => sum + (s.quantity * (s.currentPrice || s.averagePrice)), 0)
  const totalGain = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Renda Variável
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
            Novo Ativo
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
          <Typography variant="h5" fontWeight="bold" color={totalGain >= 0 ? 'success.main' : 'error.main'}>
            R$ {currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Ganho/Perda</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" fontWeight="bold" color={totalGain >= 0 ? 'success.main' : 'error.main'}>
              {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)}%
            </Typography>
            {totalGain >= 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">Dividendos (Mês)</Typography>
          <Typography variant="h5" fontWeight="bold">R$ 0,00</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Carteira de Ativos</Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Ticker</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell align="right"><strong>Quantidade</strong></TableCell>
                  <TableCell align="right"><strong>Preço Médio</strong></TableCell>
                  <TableCell align="right"><strong>Preço Atual</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                  <TableCell align="right"><strong>Ganho/Perda</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock) => {
                  const currentPrice = stock.currentPrice || stock.averagePrice
                  const gain = stock.gain || (stock.averagePrice > 0 ? ((currentPrice - stock.averagePrice) / stock.averagePrice * 100) : 0)

                  return (
                    <TableRow key={stock.id} hover>
                      <TableCell><strong>{stock.ticker}</strong></TableCell>
                      <TableCell>
                        <Chip
                          label={stock.type}
                          size="small"
                          color={stock.type === 'Ação' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell align="right">{stock.quantity}</TableCell>
                      <TableCell align="right">R$ {stock.averagePrice.toFixed(2)}</TableCell>
                      <TableCell align="right">R$ {currentPrice.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        R$ {(stock.quantity * currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: gain >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {gain >= 0 ? '+' : ''}{gain.toFixed(2)}%
                          {gain >= 0 ?
                            <TrendingUpIcon fontSize="small" /> :
                            <TrendingDownIcon fontSize="small" />
                          }
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {stocks.length === 0 && (
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
          <VariableIncomeForm
            onSuccess={handleFormSuccess}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

    </Grid>
  )
}
