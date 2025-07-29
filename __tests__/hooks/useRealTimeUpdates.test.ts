
// __tests__/hooks/useRealTimeUpdates.test.ts
import { renderHook, act } from '@testing-library/react'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
import { INITIAL_CONTESTANTS } from '@/utils/constants'
import type { Contestant } from '@/types'

describe('useRealTimeUpdates', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('updates contestant votes periodically', () => {
        const contestants = [...INITIAL_CONTESTANTS]
        const setContestants = jest.fn()

        const { result } = renderHook(() =>
            useRealTimeUpdates(contestants, setContestants)
        )

        expect(result.current.isUpdating).toBe(false)

        act(() => {
            jest.advanceTimersByTime(2000) // Advance to trigger update
        })

        expect(setContestants).toHaveBeenCalled()

        act(() => {
            jest.advanceTimersByTime(500) // Wait for updating state to change
        })

        // The isUpdating state should have been true during update
        // and then false after the timeout
    })

    test('cleans up interval on unmount', () => {
        const contestants = [...INITIAL_CONTESTANTS]
        const setContestants = jest.fn()

        const { unmount } = renderHook(() =>
            useRealTimeUpdates(contestants, setContestants)
        )

        const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

        unmount()

        expect(clearIntervalSpy).toHaveBeenCalled()
        clearIntervalSpy.mockRestore()
    })
})
