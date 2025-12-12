'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { portfolioApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

// Mock data for charts
const evolutionData = [
  { month: 'Jul', value: 140000 },
  { month: 'Ago', value: 142000 },
  { month: 'Set', value: 145000 },
  { month: 'Out', value: 148000 },
  { month: 'Nov', value: 150000 },
  { month: 'Dez', value: 152450 },
]

const allocationData = [
  { name: 'Renda Fixa', value: 60, color: '#009963' },
  { name: 'Ações', value: 25, color: '#0066CC' },
  { name: 'FIIs', value: 10, color: '#FF9800' },
  { name: 'Criptomoedas', value: 5, color: '#9C27B0' },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const { showError } = useSnackbar()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await portfolioApi.getSummary()
        setSummary(response.data)
      } catch (error: any) {
        showError('Erro ao carregar dados do portfolio')
        setSummary({
          totalValue: 152450,
          profitability: 12.8,
          monthlyDividends: 845,
          monthlyChange: 2.5
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [showError])

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
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Visão Geral
        </Typography>
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Patrimônio Total</Typography>
            <Typography variant="h4" fontWeight="bold">
              R$ {summary?.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'success.main' }}>
              <TrendingUpIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                +{summary?.monthlyChange || 0}% este mês
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Rentabilidade Global</Typography>
            <Typography variant="h4" fontWeight="bold">{summary?.profitability || 0}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'success.main' }}>
              <TrendingUpIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>Acima do CDI (10.5%)</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Proventos (Mês)</Typography>
            <Typography variant="h4" fontWeight="bold">
              R$ {summary?.monthlyDividends?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Próximo pagamento: 15/12
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Evolução Patrimonial</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value: number) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#009963"
                strokeWidth={3}
                dot={{ fill: '#009963', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Alocação</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Highlights */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Destaques
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{
          borderLeft: '4px solid #4caf50',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateX(4px)' }
        }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">Maior Alta</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography>PETR4</Typography>
              <Typography color="success.main" fontWeight="bold">+4.5%</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{
          borderLeft: '4px solid #f44336',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateX(4px)' }
        }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">Maior Baixa</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography>MGLU3</Typography>
              <Typography color="error.main" fontWeight="bold">-2.1%</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
