'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Alert from '@mui/material/Alert'

const mockPreviewData = [
  { ticker: 'PETR4', type: 'Ação', quantity: 100, price: 35.50, date: '2024-01-15' },
  { ticker: 'VALE3', type: 'Ação', quantity: 50, price: 68.00, date: '2024-02-20' },
  { ticker: 'MXRF11', type: 'FII', quantity: 200, price: 10.50, date: '2024-03-10' },
]

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handlePreview = () => {
    setPreview(true)
  }

  const handleImport = () => {
    alert('Dados importados com sucesso!')
    setPreview(false)
    setFile(null)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Importação de Dados
        </Typography>
        <Typography color="text.secondary">
          Importe transações de suas corretoras via CSV ou Excel
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'primary.main' }}>
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Arraste seu arquivo ou clique para selecionar
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Formatos aceitos: CSV, Excel (.xlsx)
          </Typography>

          <input
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" size="large">
              Selecionar Arquivo
            </Button>
          </label>

          {file && (
            <Box sx={{ mt: 2 }}>
              <Alert icon={<CheckCircleIcon />} severity="success">
                <strong>{file.name}</strong> selecionado
              </Alert>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={handlePreview}
              >
                Visualizar Prévia
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>

      {preview && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Prévia dos Dados
            </Typography>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Ticker</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell align="right"><strong>Quantidade</strong></TableCell>
                      <TableCell align="right"><strong>Preço</strong></TableCell>
                      <TableCell><strong>Data</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPreviewData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.ticker}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">R$ {row.price.toFixed(2)}</TableCell>
                        <TableCell>{new Date(row.date).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => setPreview(false)}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleImport}>
                Confirmar Importação
              </Button>
            </Box>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Instruções para Importação
          </Typography>
          <Typography component="div">
            <ol>
              <li>Baixe o arquivo de transações da sua corretora</li>
              <li>O arquivo deve conter as colunas: Ticker, Tipo, Quantidade, Preço, Data</li>
              <li>Faça o upload do arquivo usando o botão acima</li>
              <li>Verifique a prévia e confirme a importação</li>
            </ol>
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Dica:</strong> Você pode baixar um modelo de arquivo CSV clicando{' '}
            <a href="#" style={{ color: 'inherit', fontWeight: 'bold' }}>aqui</a>
          </Alert>
        </Paper>
      </Grid>
    </Grid>
  )
}
