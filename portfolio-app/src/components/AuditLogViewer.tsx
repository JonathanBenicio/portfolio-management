'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { walletApi, AuditLog } from '@/lib/api'

interface AuditLogViewerProps {
  walletId: number
}

export default function AuditLogViewer({ walletId }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [walletId])

  const fetchLogs = async () => {
    try {
      const response = await walletApi.getHistory(walletId)
      setLogs(response.data)
    } catch (error) {
      console.error('Error fetching history', error)
      // Fallback for demo if backend not ready or empty
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return <AddCircleIcon color="success" />
      case 'update':
        return <EditIcon color="primary" />
      case 'delete':
        return <DeleteIcon color="error" />
      default:
        return <HistoryIcon />
    }
  }

  const formatChanges = (changes: string) => {
    try {
      const parsed = JSON.parse(changes)
      // Simplified display: just show key fields or raw JSON if complex
      return (
        <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>
          {Object.entries(parsed).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          )).slice(0, 5)}
          {/* Limit detailed view to 5 fields */}
        </Box>
      )
    } catch (e) {
      return changes
    }
  }

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>

  if (logs.length === 0) {
    return (
      <Box p={4} textAlign="center" color="text.secondary">
        <HistoryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
        <Typography>Nenhum histórico encontrado para esta carteira.</Typography>
      </Box>
    )
  }

  return (
    <List>
      {logs.map((log, index) => (
        <Paper key={log.id} sx={{ mb: 2, p: 1 }} elevation={0} variant="outlined">
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'transparent' }}>
                {getIcon(log.action)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {log.action} - {log.entityType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              }
              secondary={
                <Box component="span">
                  <Typography variant="body2" color="text.secondary">
                    ID do registro: {log.entityId}
                  </Typography>
                  {formatChanges(log.changes)}
                </Box>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  )
}
