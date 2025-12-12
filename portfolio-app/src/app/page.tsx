import Link from 'next/link'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" color="primary">
          Portfolio Manager
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Gerencie seus investimentos com inteligência e simplicidade.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Link href="/login" passHref>
            <Button variant="contained" size="large">
              Entrar
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button variant="outlined" size="large">
              Criar Conta
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  )
}
