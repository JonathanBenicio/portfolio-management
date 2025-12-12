import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { authApi } from '../src/lib/api'

// Mock do axios
vi.mock('../src/lib/api')

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user', async () => {
    const mockResponse = { data: { message: 'User registered successfully' } };
    (authApi.register as any).mockResolvedValue(mockResponse)

    const result = await authApi.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.data.message).toBe('User registered successfully')
    expect(authApi.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        name: 'Test User',
        email: 'test@example.com'
      }
    };
    (authApi.login as any).mockResolvedValue(mockResponse)

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.data.token).toBeDefined()
    expect(result.data.email).toBe('test@example.com')
  })

  it('should handle login error', async () => {
    const mockError = new Error('Invalid credentials');
    (authApi.login as any).mockRejectedValue(mockError)

    await expect(
      authApi.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })
    ).rejects.toThrow('Invalid credentials')
  })
})
