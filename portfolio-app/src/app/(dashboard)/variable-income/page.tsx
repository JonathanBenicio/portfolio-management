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
import { variableIncomeApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

export default function VariableIncomePage() {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await variableIncomeApi.getAll()
      setStocks(response.data)
    } catch (error) {
      showError('Erro ao carregar renda variável')
      // Fallback to mock data
      setStocks([
        { id: 1, ticker: 'PETR4', type: 'Ação', quantity: 100, averagePrice: 35.50, currentPrice: 38.20, gain: 7.6 },
        { id: 2, ticker: 'VALE3', type: 'Ação', quantity: 50, averagePrice: 68.00, currentPrice: 71.50, gain: 5.1 },
        { id: 3, ticker: 'MXRF11', type: 'FII', quantity: 200, averagePrice: 10.50, currentPrice: 11.20, gain: 6.7 },
        { id: 4, ticker: 'ITSA4', type: 'Ação', quantity: 150, averagePrice: 9.80, currentPrice: 9.50, gain: -3.1 },
      ])
    } finally {
      setLoading(false)
    }
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
          <Button variant="contained" startIcon={<AddIcon />}>
            Registrar Transação
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
          <Typography variant="h5" fontWeight="bold">R$ 845,00</Typography>
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
                  const gain = stock.gain || ((currentPrice - stock.averagePrice) / stock.averagePrice * 100)

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
                      <TableCell align="right" fontWeight="bold">
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
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Próximos Dividendos</Typography>
          <Typography color="text.secondary">PETR4 - R$ 0.42/ação em 15/12</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}
