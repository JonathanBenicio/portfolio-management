'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { analysisApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

// Mock data
const benchmarkData = [
  { month: 'Jul', portfolio: 5, ibovespa: 3, cdi: 0.9, ipca: 0.3 },
  { month: 'Ago', portfolio: 6, ibovespa: 4, cdi: 0.9, ipca: 0.4 },
  { month: 'Set', portfolio: 8, ibovespa: 5, cdi: 0.95, ipca: 0.35 },
  { month: 'Out', portfolio: 10, ibovespa: 6.5, cdi: 0.9, ipca: 0.4 },
  { month: 'Nov', portfolio: 11, ibovespa: 7, cdi: 0.92, ipca: 0.38 },
  { month: 'Dez', portfolio: 12.8, ibovespa: 8, cdi: 0.88, ipca: 0.42 },
]

const sectorData = [
  { name: 'Tecnologia', value: 25, color: '#0066CC' },
  { name: 'Financeiro', value: 20, color: '#009963' },
  { name: 'Petróleo', value: 18, color: '#FF9800' },
  { name: 'Varejo', value: 15, color: '#9C27B0' },
  { name: 'Utilities', value: 12, color: '#F44336' },
  { name: 'Outros', value: 10, color: '#607D8B' },
]

const performanceData = [
  { ticker: 'PETR4', performance: 12.5 },
  { ticker: 'VALE3', performance: 8.2 },
  { ticker: 'ITSA4', performance: -3.1 },
  { ticker: 'MXRF11', performance: 6.7 },
  { ticker: 'BBDC4', performance: 4.5 },
]

export default function AnalysisPage() {
  const [period, setPeriod] = useState('6M')
  const [asset, setAsset] = useState('all')
  const [loading, setLoading] = useState(true)
  const { showError } = useSnackbar()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await analysisApi.getBenchmarks()
        await analysisApi.getSectors()
      } catch (error) {
        showError('Erro ao carregar análises')
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
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Análise Detalhada
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Ativo</InputLabel>
          <Select value={asset} onChange={(e) => setAsset(e.target.value)} label="Ativo">
            <MenuItem value="all">Carteira Completa</MenuItem>
            <MenuItem value="PETR4">PETR4</MenuItem>
            <MenuItem value="VALE3">VALE3</MenuItem>
            <MenuItem value="MXRF11">MXRF11</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Período</InputLabel>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Período">
            <MenuItem value="1M">1 Mês</MenuItem>
            <MenuItem value="3M">3 Meses</MenuItem>
            <MenuItem value="6M">6 Meses</MenuItem>
            <MenuItem value="1Y">1 Ano</MenuItem>
            <MenuItem value="ALL">Tudo</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Comparação com Índices</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sua carteira vs Ibovespa, CDI e IPCA (%)
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" label={{ value: '%', position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="portfolio" stroke="#009963" strokeWidth={3} name="Minha Carteira" />
              <Line type="monotone" dataKey="ibovespa" stroke="#0066CC" strokeWidth={2} name="Ibovespa" />
              <Line type="monotone" dataKey="cdi" stroke="#FF9800" strokeWidth={2} name="CDI" />
              <Line type="monotone" dataKey="ipca" stroke="#F44336" strokeWidth={2} name="IPCA" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Alocação por Setor</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Performance Individual</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="ticker" stroke="#666" />
              <YAxis stroke="#666" label={{ value: '%', position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Bar dataKey="performance" fill="#009963">
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.performance >= 0 ? '#4caf50' : '#f44336'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, bgcolor: 'primary.dark', color: 'white' }}>
          <Typography variant="body2">Melhor Mês</Typography>
          <Typography variant="h5" fontWeight="bold">Março 2024</Typography>
          <Typography variant="h6">+8.5%</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
          <Typography variant="body2">Retorno Acumulado</Typography>
          <Typography variant="h5" fontWeight="bold">6 Meses</Typography>
          <Typography variant="h6">+15.2%</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, bgcolor: 'info.main', color: 'white' }}>
          <Typography variant="body2">vs CDI</Typography>
          <Typography variant="h5" fontWeight="bold">Desempenho</Typography>
          <Typography variant="h6">+4.7%</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}
