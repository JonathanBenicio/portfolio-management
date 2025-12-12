'use client'

import { useState } from 'react'
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

  const handleSend = () => {
    if (!input.trim()) return

    const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, newUserMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Ainda estou em desenvolvimento, mas em breve poderei analisar sua carteira e dar dicas!',
        sender: 'ai'
      }])
    }, 1000)
  }

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Assistente IA
      </Typography>

      <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', bgcolor: '#f8f9fa' }}>
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
              {msg.sender === 'ai' && <Avatar sx={{ bgcolor: 'secondary.main' }}><SmartToyIcon /></Avatar>}

              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>

              {msg.sender === 'user' && <Avatar sx={{ bgcolor: 'primary.dark' }}><PersonIcon /></Avatar>}
            </Box>
          ))}
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Digite sua dúvida sobre investimentos..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ bgcolor: 'white' }}
        />
        <IconButton
          color="primary"
          size="large"
          onClick={handleSend}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
