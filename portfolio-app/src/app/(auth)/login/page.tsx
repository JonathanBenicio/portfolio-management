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

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      // Redirect is handled by auth context
    } catch (err: any) {
      setError(err.message || 'Falha no login. Verifique suas credenciais.')
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
                Entre na sua conta
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </form>

            <Typography align="center" variant="body2">
              Não tem uma conta?{' '}
              <Link href="/register" style={{ color: '#009963', fontWeight: 'bold', textDecoration: 'none' }}>
                Cadastre-se
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
