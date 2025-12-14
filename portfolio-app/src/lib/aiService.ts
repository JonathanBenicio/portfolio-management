// AI Service - Handles communication with AI providers using user's API key
import { apiKeyApi } from './api'

export type AIProvider = 'OpenAI' | 'Google'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  message: string
  error?: string
}

class AIService {
  private apiKey: string | null = null
  private provider: AIProvider = 'OpenAI'
  private model: string = ''
  private disableThinking: boolean = false

  // Default models map
  private readonly defaultModels = {
    'OpenAI': 'gpt-3.5-turbo',
    'Google': 'gemini-1.5-flash'
  }

  setProvider(provider: AIProvider) {
    this.provider = provider
    this.apiKey = null // Reset key when provider changes to force re-fetch
    this.model = this.defaultModels[provider]
  }

  setModel(model: string) {
    this.model = model
  }

  setDisableThinking(disable: boolean) {
    this.disableThinking = disable
  }

  getProvider(): AIProvider {
    return this.provider
  }

  async initialize(provider?: AIProvider): Promise<boolean> {
    if (provider) {
      this.setProvider(provider)
    }

    // Set default model if not set
    if (!this.model) {
      this.model = this.defaultModels[this.provider]
    }

    try {
      const response = await apiKeyApi.getActive(this.provider)
      this.apiKey = response.data.apiKey
      return true
    } catch (error) {
      console.error(`No API key configured for ${this.provider}`)
      return false
    }
  }

  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.apiKey) {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          message: '',
          error: `Por favor, configure sua API key do ${this.provider} nas configurações.`
        }
      }
    }

    // Configure endpoint based on provider
    let apiUrl = ''

    if (this.provider === 'Google') {
      // Google Gemini (OpenAI Compatibility Mode)
      // Doc: https://ai.google.dev/gemini-api/docs/openai
      apiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    } else {
      // OpenAI Standard
      apiUrl = 'https://api.openai.com/v1/chat/completions'
    }

    // Handle "Disable Thinking" (Force direct answer)
    let finalMessages = [...messages]
    if (this.disableThinking) {
      const systemInstruction = {
        role: 'system' as const, // Force type casting
        content: 'Answer directly and concisely. Do not explain your reasoning process unless asked. Go straight to the point.'
      }

      // If there's already a system message, append to it, otherwise add new one
      const systemIndex = finalMessages.findIndex(m => m.role === 'system')
      if (systemIndex >= 0) {
        finalMessages[systemIndex] = {
          ...finalMessages[systemIndex],
          content: `${finalMessages[systemIndex].content}\n\nIMPORTANT: ${systemInstruction.content}`
        }
      } else {
        finalMessages.unshift(systemInstruction)
      }
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model || this.defaultModels[this.provider], // Fallback to default
          messages: finalMessages,
          temperature: this.disableThinking ? 0.3 : 0.7, // Lower temperature if thinking is disabled
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `Erro ao comunicar com a API do ${this.provider}`)
      }

      const data = await response.json()
      return {
        message: data.choices[0]?.message?.content || 'Sem resposta'
      }

    } catch (error: any) {
      console.error('AI Service error:', error)

      // Retry logic if key might be invalid or expired
      if (error.status === 401 || error.message?.includes('key')) {
        this.apiKey = null
      }

      return {
        message: '',
        error: error.message || 'Erro ao processar sua mensagem'
      }
    }
  }

  clearApiKey() {
    this.apiKey = null
  }
}

export const aiService = new AIService()
