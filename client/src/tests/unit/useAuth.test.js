// useAuth.test.js - Unit tests for useAuth custom hook

import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '../../../hooks/useAuth';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should load user from localStorage on mount', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
  });

  it('should login user successfully', async () => {
    const mockUser = { id: '123', email: 'test@example.com', token: 'token123' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should handle login errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrongpassword');
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });
    
    expect(result.current.user).toBeNull();
  });

  it('should logout user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('should handle register', async () => {
    const mockUser = { id: '123', email: 'test@example.com', token: 'token123' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.register('testuser', 'test@example.com', 'password123');
    });
    
    expect(result.current.user).toEqual(mockUser);
  });
});