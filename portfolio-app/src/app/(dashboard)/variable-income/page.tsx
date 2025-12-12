'use client'

import { useState } from 'react'
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

// Mock data
const mockStocks = [
  { id: 1, ticker: 'PETR4', type: 'Ação', quantity: 100, avgPrice: 35.50, currentPrice: 38.20, gain: 7.6 },
  { id: 2, ticker: 'VALE3', type: 'Ação', quantity: 50, avgPrice: 68.00, currentPrice: 71.50, gain: 5.1 },
  { id: 3, ticker: 'MXRF11', type: 'FII', quantity: 200, avgPrice: 10.50, currentPrice: 11.20, gain: 6.7 },
  { id: 4, ticker: 'ITSA4', type: 'Ação', quantity: 150, avgPrice: 9.80, currentPrice: 9.50, gain: -3.1 },
]

export default function VariableIncomePage() {
  const totalInvested = mockStocks.reduce((sum, s) => sum + (s.quantity * s.avgPrice), 0)
  const currentValue = mockStocks.reduce((sum, s) => sum + (s.quantity * s.currentPrice), 0)
  const totalGain = ((currentValue - totalInvested) / totalInvested) * 100

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
                {mockStocks.map((stock) => (
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
                    <TableCell align="right">R$ {stock.avgPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">R$ {stock.currentPrice.toFixed(2)}</TableCell>
                    <TableCell align="right" fontWeight="bold">
                      R$ {(stock.quantity * stock.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: stock.gain >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {stock.gain >= 0 ? '+' : ''}{stock.gain.toFixed(2)}%
                        {stock.gain >= 0 ?
                          <TrendingUpIcon fontSize="small" /> :
                          <TrendingDownIcon fontSize="small" />
                        }
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Histórico de Dividendos</Typography>
          <Typography color="text.secondary">Próximo pagamento: PETR4 - R$ 0.42/ação em 15/12</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}
