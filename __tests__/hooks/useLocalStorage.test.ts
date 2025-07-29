import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

describe('useLocalStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue(null)
    })

    test('returns initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        expect(result.current[0]).toBe('initial')
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    test('sets value in localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        act(() => {
            result.current[1]('new value')
        })

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'))
    })

    test('handles localStorage errors gracefully', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
            throw new Error('localStorage error')
        })

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))

        expect(result.current[0]).toBe('fallback')
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })
})