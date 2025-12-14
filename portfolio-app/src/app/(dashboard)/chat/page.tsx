'use client'

import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import TuneIcon from '@mui/icons-material/Tune'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'
import { chatApi } from '@/lib/api'
import { aiService, AIMessage } from '@/lib/aiService'
import ApiKeyDialog from '@/components/ApiKeyDialog'
import ChatPreferencesDialog from '@/components/ChatPreferencesDialog'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Olá! Sou seu assistente de investimentos. Como posso ajudar com sua carteira hoje?', sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)

  // Dialog States
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check if API key is configured on mount
    checkApiKey()
  }, [])

  const checkApiKey = async () => {
    const configured = await aiService.initialize()
    setApiKeyConfigured(configured)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    // Check if API key is configured
    if (apiKeyConfigured === false) {
      setShowApiKeyDialog(true)
      return
    }

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Build conversation history for AI
      const aiMessages: AIMessage[] = [
        {
          role: 'system',
          content: 'Você é um assistente especializado em investimentos e finanças pessoais. Ajude o usuário com análises de carteira, sugestões de investimentos e educação financeira. Seja claro, objetivo e sempre baseie suas respostas em boas práticas financeiras.'
        },
        ...messages.slice(-5).map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text
        })),
        {
          role: 'user',
          content: input
        }
      ]

      // Call AI service
      const aiResponse = await aiService.sendMessage(aiMessages)

      if (aiResponse.error) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: aiResponse.error,
          sender: 'ai'
        }])

        if (aiResponse.error.includes('configure sua API key')) {
          setApiKeyConfigured(false)
          setShowApiKeyDialog(true)
        }
      } else {
        // Save to backend for history
        try {
          const response = await chatApi.sendMessage({
            message: input,
            conversationId: conversationId || undefined
          })

          if (!conversationId) {
            setConversationId(response.data.conversationId)
          }
        } catch (error) {
          console.error('Error saving to backend:', error)
        }

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: aiResponse.message,
          sender: 'ai'
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'ai'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleApiKeySaved = () => {
    checkApiKey()
  }

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Assistente IA
        </Typography>
        <Box>
          <Tooltip title="Preferências do Chat">
            <IconButton onClick={() => setShowPreferencesDialog(true)} color="default" sx={{ mr: 1 }}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configurar API Key">
            <IconButton onClick={() => setShowApiKeyDialog(true)} color="primary">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {apiKeyConfigured === false && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <IconButton color="inherit" size="small" onClick={() => setShowApiKeyDialog(true)}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        }>
          Configure sua API key para usar o assistente de IA
        </Alert>
      )}

      <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {msg.sender === 'ai' && (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <SmartToyIcon />
                </Avatar>
              )}

              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </Typography>
              </Paper>

              {msg.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'primary.dark' }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <SmartToyIcon />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Digite sua dúvida sobre investimentos..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
          sx={{ bgcolor: 'background.paper' }}
        />
        <IconButton
          color="primary"
          size="large"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      <ApiKeyDialog
        open={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSaved={handleApiKeySaved}
      />

      <ChatPreferencesDialog
        open={showPreferencesDialog}
        onClose={() => setShowPreferencesDialog(false)}
      />
    </Box>
  )
}
