'use client'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

// Mock Component for Chart
const MockChart = ({ title }: { title: string }) => (
  <Box sx={{ height: 200, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
    <Typography color="text.secondary">{title}</Typography>
  </Box>
)

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Visão Geral
        </Typography>
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Patrimônio Total</Typography>
            <Typography variant="h4" fontWeight="bold">R$ 152.450,00</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'success.main' }}>
              <TrendingUpIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>+2.5% este mês</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Rentabilidade Global</Typography>
            <Typography variant="h4" fontWeight="bold">12.8%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'success.main' }}>
              <TrendingUpIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>Acima do CDI (10.5%)</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Proventos (Mês)</Typography>
            <Typography variant="h4" fontWeight="bold">R$ 845,00</Typography>
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
          <MockChart title="Gráfico de Linha (Recharts)" />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Alocação</Typography>
          <MockChart title="Gráfico de Pizza (Recharts)" />
        </Paper>
      </Grid>

      {/* Highlights */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Destaques
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderLeft: '4px solid #4caf50' }}>
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
        <Card sx={{ borderLeft: '4px solid #f44336' }}>
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
