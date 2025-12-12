'use client'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

const MockChart = ({ title, height = 300 }: { title: string; height?: number }) => (
  <Box sx={{ height, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, border: '1px dashed #ccc' }}>
    <Typography color="text.secondary">{title}</Typography>
  </Box>
)

export default function AnalysisPage() {
  const [period, setPeriod] = useState('6M')
  const [asset, setAsset] = useState('all')

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
            Sua carteira vs Ibovespa, CDI e IPCA
          </Typography>
          <MockChart title="Gráfico de Linha Comparativo (Recharts)" height={350} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Alocação por Setor</Typography>
          <MockChart title="Gráfico de Pizza - Setores (Recharts)" />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Performance Individual</Typography>
          <MockChart title="Gráfico de Barras - Performance (Recharts)" />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Projeção de Dividendos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Baseado no histórico dos últimos 12 meses
          </Typography>
          <MockChart title="Gráfico de Linha - Projeção (Recharts)" height={250} />
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
