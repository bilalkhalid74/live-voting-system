
// __tests__/hooks/useVotingWindow.test.ts
import { renderHook, act } from '@testing-library/react'
import { useVotingWindow } from '@/hooks/useVotingWindow'

describe('useVotingWindow', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('initializes with active voting window', () => {
        const { result } = renderHook(() => useVotingWindow())

        expect(result.current.isActive).toBe(true)
        expect(result.current.remainingTime).toBeGreaterThan(0)
        expect(result.current.formattedTime).toMatch(/^\d+:\d{2}$/)
    })

    test('updates remaining time', () => {
        const { result } = renderHook(() => useVotingWindow())
        const initialTime = result.current.remainingTime

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(result.current.remainingTime).toBeLessThan(initialTime)
    })

    test('formats time correctly', () => {
        const { result } = renderHook(() => useVotingWindow())

        // Should format as MM:SS
        expect(result.current.formattedTime).toMatch(/^\d+:\d{2}$/)
    })

    test('deactivates when time expires', () => {
        const { result } = renderHook(() => useVotingWindow())

        act(() => {
            // Fast forward past the voting duration
            jest.advanceTimersByTime(400000) // More than 5 minutes
        })

        expect(result.current.isActive).toBe(false)
        expect(result.current.remainingTime).toBe(0)
        expect(result.current.formattedTime).toBe('0:00')
    })
})
