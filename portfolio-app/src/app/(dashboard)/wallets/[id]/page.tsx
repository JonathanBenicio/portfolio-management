'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Stack,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogContent
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { walletApi, Wallet, WalletAnalytics, WalletEvolution } from '@/lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/format'
import FixedIncomeForm from '@/components/FixedIncomeForm'
import VariableIncomeForm from '@/components/VariableIncomeForm'
import AuditLogViewer from '@/components/AuditLogViewer'
import { useSnackbar } from '@/lib/snackbar'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export default function WalletDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const walletId = Number(params.id)
  const { showSuccess, showError } = useSnackbar()

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [analytics, setAnalytics] = useState<WalletAnalytics | null>(null)
  const [evolution, setEvolution] = useState<WalletEvolution[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  // Forms State
  const [openFixedForm, setOpenFixedForm] = useState(false)
  const [openVariableForm, setOpenVariableForm] = useState(false)

  const fetchData = async () => {
    try {
      const [walletRes, analyticsRes, evolutionRes] = await Promise.all([
        walletApi.getById(walletId),
        walletApi.getAnalytics(walletId),
        walletApi.getEvolution(walletId)
      ])
      setWallet(walletRes.data)
      setAnalytics(analyticsRes.data)
      setEvolution(evolutionRes.data)
    } catch (error) {
      console.error('Error fetching details', error)
      showError('Erro ao carregar dados da carteira')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (walletId) fetchData()
  }, [walletId])

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenFixed = () => {
    handleMenuClose()
    setOpenFixedForm(true)
  }

  const handleOpenVariable = () => {
    handleMenuClose()
    setOpenVariableForm(true)
  }

  const handleFormSuccess = () => {
    setOpenFixedForm(false)
    setOpenVariableForm(false)
    showSuccess('Ativo adicionado com sucesso!')
    fetchData() // Refresh data
  }

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
  if (!wallet) return <Typography>Carteira não encontrada</Typography>

  const isProfit = (analytics?.totalProfit || 0) >= 0

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/wallets')}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 12,
              height: 48,
              bgcolor: wallet.color,
              borderRadius: 1
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {wallet.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={wallet.broker} />
              <Typography color="text.secondary" variant="body2">
                Titular: {wallet.ownerName}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleMenuClick}
          >
            Novo Aporte
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleOpenFixed}>Renda Fixa</MenuItem>
            <MenuItem onClick={handleOpenVariable}>Renda Variável</MenuItem>
          </Menu>
        </Stack>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Visão Geral" />
          <Tab label="Histórico" />
          <Tab label="Análise & Gráficos" />
        </Tabs>
      </Box>

      {/* Visão Geral */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} mb={4}>
          {/* Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography color="text.secondary" gutterBottom>Total Investido</Typography>
              <Typography variant="h4" fontWeight="bold">
                {(analytics?.totalInvested || 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography color="text.secondary" gutterBottom>Valor Atual</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {formatCurrency(analytics?.totalCurrent || 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography color="text.secondary" gutterBottom>Lucro / Prejuízo</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  varianformatCurrencyt="h4"
                  fontWeight="bold"
                  color={isProfit ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(analytics?.totalProfit || 0)}
                </Typography>
                {isProfit ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
              </Stack>
              <Typography variant="body2" color={isProfit ? 'success.main' : 'error.main'}>
                {analytics?.monthlyReturnPercentage}% este mês
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Investimentos</Typography>
        <Paper>
          {analytics?.assets.map((asset, index) => (
            <Box key={asset.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <Box>
                  <Typography fontWeight="medium">{asset.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{asset.type}</Typography>
                </Box>
                <Stack alignItems="end">
                  <Typography fontWeight="medium">{formatCurrency(asset.current)}</Typography>
                  <Typography
                    variant="caption"
                    color={asset.profit >= 0 ? 'success.main' : 'error.main'}
                  >
                    {asset.profit >= 0 ? '+' : ''}{formatCurrency(asset.profit)}
                  </Typography>
                </Stack>
              </Stack>
              {index < (analytics?.assets.length || 0) - 1 && <Divider />}
            </Box>
          ))}
          {(!analytics?.assets || analytics.assets.length === 0) && (
            <Box p={3} textAlign="center" color="text.secondary">
              Nenhum investimento nesta carteira.
            </Box>
          )}
        </Paper>
      </TabPanel>

      {/* Histórico */}
      <TabPanel value={tabValue} index={1}>
        <AuditLogViewer walletId={walletId} />
      </TabPanel>

      {/* Gráficos */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Evolução Patrimonial</Typography>
        <Paper sx={{ p: 3, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
              />
              <YAxis
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: number) => formatCurrency(val)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="totalValue"
                stroke={wallet.color}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </TabPanel>

      {/* Dialogs */}
      <Dialog open={openFixedForm} onClose={() => setOpenFixedForm(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <FixedIncomeForm
            onSuccess={handleFormSuccess}
            onCancel={() => setOpenFixedForm(false)}
            initialWalletId={walletId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openVariableForm} onClose={() => setOpenVariableForm(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <VariableIncomeForm
            onSuccess={handleFormSuccess}
            onCancel={() => setOpenVariableForm(false)}
            initialWalletId={walletId}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
