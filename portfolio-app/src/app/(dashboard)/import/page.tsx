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
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import { importApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

interface PreviewRow {
  ticker: string
  type: string
  quantity: number
  price: number
  date: string
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { showSuccess, showError } = useSnackbar()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Parse CSV for preview
      if (selectedFile.name.endsWith('.csv')) {
        const text = await selectedFile.text()
        const rows = text.split('\n').slice(1) // Skip header
        const parsed = rows.slice(0, 10).map(row => {
          const [ticker, type, quantity, price, date] = row.split(',')
          return {
            ticker: ticker?.trim(),
            type: type?.trim(),
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            date: date?.trim()
          }
        }).filter(row => row.ticker)

        setPreviewData(parsed)
      }
    }
  }

  const handlePreview = () => {
    if (previewData.length > 0) {
      setPreview(true)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      await importApi.uploadFile(formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      showSuccess(`${previewData.length} transações importadas com sucesso!`)
      setPreview(false)
      setFile(null)
      setPreviewData([])
      setUploadProgress(0)
    } catch (error) {
      showError('Erro ao importar arquivo')
    } finally {
      setUploading(false)
    }
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
            Formatos aceitos: CSV, Excel (.xlsx) - Máximo 10MB
          </Typography>

          <input
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              size="large"
              disabled={uploading}
            >
              Selecionar Arquivo
            </Button>
          </label>

          {file && (
            <Box sx={{ mt: 2 }}>
              <Alert icon={<CheckCircleIcon />} severity="success">
                <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </Alert>
              {!preview && (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handlePreview}
                  disabled={uploading}
                >
                  Visualizar Prévia
                </Button>
              )}
            </Box>
          )}

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Enviando... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {preview && previewData.length > 0 && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Prévia dos Dados ({previewData.length} primeiras linhas)
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
                    {previewData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.ticker}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">R$ {row.price?.toFixed(2)}</TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setPreview(false)}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : null}
              >
                {uploading ? 'Importando...' : 'Confirmar Importação'}
              </Button>
            </Box>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Formato CSV Esperado
          </Typography>
          <Typography component="div">
            O arquivo CSV deve conter as seguintes colunas:
            <Box component="pre" sx={{ bgcolor: 'action.hover', p: 2, mt: 2, borderRadius: 1, overflow: 'auto' }}>
              {`ticker,type,quantity,price,date
PETR4,Ação,100,35.50,2024-01-15
VALE3,Ação,50,68.00,2024-02-20
MXRF11,FII,200,10.50,2024-03-10`}
            </Box>
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Dica:</strong> Você pode baixar um modelo de arquivo CSV{' '}
            <a href="/template.csv" download style={{ color: 'inherit', fontWeight: 'bold' }}>aqui</a>
          </Alert>
        </Paper>
      </Grid>
    </Grid>
  )
}
