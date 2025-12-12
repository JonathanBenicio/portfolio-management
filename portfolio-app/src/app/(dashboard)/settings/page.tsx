'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'

const allocationGoals = [
  { id: 1, category: 'Renda Fixa', target: 60, current: 55 },
  { id: 2, category: 'Renda Variável', target: 30, current: 35 },
  { id: 3, category: 'FIIs', target: 10, current: 10 },
]

export default function SettingsPage() {
  const [name, setName] = useState('João Silva')
  const [email, setEmail] = useState('joao@email.com')
  const [notifications, setNotifications] = useState(true)

  const handleSave = () => {
    alert('Configurações salvas com sucesso!')
  }

  const handleExport = (format: string) => {
    alert(`Exportando dados em formato ${format}...`)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Configurações
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Perfil do Usuário
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome Completo"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Nova Senha"
              type="password"
              fullWidth
              placeholder="Deixe em branco para não alterar"
            />
            <Button variant="contained" onClick={handleSave}>
              Salvar Alterações
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preferências de Exibição
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Notificações por email"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Exibir valores detalhados"
            />
            <FormControlLabel
              control={<Switch />}
              label="Modo escuro"
            />

            <TextField
              select
              label="Moeda"
              fullWidth
              defaultValue="BRL"
              SelectProps={{ native: true }}
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar ($)</option>
              <option value="EUR">Euro (€)</option>
            </TextField>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Metas de Alocação
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Alert severity="info" sx={{ mb: 2 }}>
            Configure suas metas de alocação para receber alertas quando estiver fora do target
          </Alert>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Categoria</strong></TableCell>
                  <TableCell align="right"><strong>Meta (%)</strong></TableCell>
                  <TableCell align="right"><strong>Atual (%)</strong></TableCell>
                  <TableCell align="right"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocationGoals.map((goal) => {
                  const diff = goal.current - goal.target
                  const status = Math.abs(diff) <= 5 ? 'OK' : diff > 0 ? 'Acima' : 'Abaixo'
                  const color = Math.abs(diff) <= 5 ? 'success.main' : 'warning.main'

                  return (
                    <TableRow key={goal.id}>
                      <TableCell>{goal.category}</TableCell>
                      <TableCell align="right">{goal.target}%</TableCell>
                      <TableCell align="right">{goal.current}%</TableCell>
                      <TableCell align="right">
                        <Typography sx={{ color, fontWeight: 'bold' }}>
                          {status}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="outlined" sx={{ mt: 2 }}>
            Adicionar Meta
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Exportação de Dados
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Exporte todos os seus dados de carteira para backup ou análise externa
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => handleExport('CSV')}>
              Exportar CSV
            </Button>
            <Button variant="outlined" onClick={() => handleExport('JSON')}>
              Exportar JSON
            </Button>
            <Button variant="outlined" onClick={() => handleExport('PDF')}>
              Exportar PDF
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
