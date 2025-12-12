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
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { chatApi } from '@/lib/api'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatApi.sendMessage({
        message: input,
        conversationId: conversationId || undefined
      })

      const { aiMessage, conversationId: newConversationId } = response.data

      if (!conversationId) {
        setConversationId(newConversationId)
      }

      setMessages(prev => [...prev, {
        id: aiMessage.id,
        text: aiMessage.content,
        sender: 'ai'
      }])
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

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Assistente IA
      </Typography>

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
    </Box>
  )
}
