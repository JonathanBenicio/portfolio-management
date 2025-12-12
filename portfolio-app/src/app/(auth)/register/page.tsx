'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    try {
      await register(name, email, password)
      setSuccess('Conta criada com sucesso! Redirecionando para login...')
      // Redirect is handled by auth context
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Card elevation={4}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Portfolio
              </Typography>
              <Typography color="text.secondary">
                Crie sua conta
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TextField
                label="Nome Completo"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                helperText="Mínimo 6 caracteres"
              />
              <TextField
                label="Confirmar Senha"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
              </Button>
            </form>

            <Typography align="center" variant="body2">
              Já tem uma conta?{' '}
              <Link href="/login" style={{ color: '#009963', fontWeight: 'bold', textDecoration: 'none' }}>
                Entrar
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
