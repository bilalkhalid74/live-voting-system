import { renderHook, act, waitFor } from '@testing-library/react'
import { useVoting } from '@/hooks/useVoting'
import { VOTING_CONFIG } from '@/utils/constants'

// Mock localStorage
const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {}

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key]
        }),
        clear: jest.fn(() => {
            store = {}
        }),
        get store() {
            return store
        }
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

// Mock Math.random to control failure simulation
const mockMathRandom = jest.spyOn(Math, 'random')

describe('useVoting - Critical localStorage Test', () => {
    const contestantId = 'test-contestant-1'
    const storageKey = `vote_${contestantId}`

    beforeEach(() => {
        jest.clearAllMocks()
        mockLocalStorage.clear()
        mockMathRandom.mockReturnValue(0.05) // Force success
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    test('CRITICAL: Vote button disables after voting and remains disabled after page reload', async () => {
        const { result: initialResult } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(initialResult.current.canVote).not.toBeUndefined())

        expect(initialResult.current.votesUsed).toBe(0)

        // Cast a vote
        await act(async () => {
            const votePromise = initialResult.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            await votePromise
        })

        expect(initialResult.current.votesUsed).toBe(1)

        // Cast remaining votes
        for (let i = 1; i < VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT; i++) {
            await act(async () => {
                const votePromise = initialResult.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
                await votePromise
            })
        }

        expect(initialResult.current.canVote).toBe(false)

        // Simulate page reload
        const { result: reloadedResult } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(reloadedResult.current.canVote).not.toBeUndefined())

        expect(reloadedResult.current.canVote).toBe(false)
        expect(reloadedResult.current.votesUsed).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT)

        // Vote should not increase
        const initialVoteCount = reloadedResult.current.votesUsed

        await act(async () => {
            const votePromise = reloadedResult.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            await votePromise
        })

        expect(reloadedResult.current.votesUsed).toBe(initialVoteCount)
    })

    test('Vote state persists correctly across multiple page reloads', async () => {
        const { result: firstSession } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(firstSession.current.canVote).not.toBeUndefined())

        for (let i = 0; i < 2; i++) {
            await act(async () => {
                const votePromise = firstSession.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
                await votePromise
            })
        }

        expect(firstSession.current.votesUsed).toBe(2)

        const { result: secondSession } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(secondSession.current.votesUsed).toBe(2))

        await act(async () => {
            const votePromise = secondSession.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            await votePromise
        })

        expect(secondSession.current.votesUsed).toBe(3)
        expect(secondSession.current.canVote).toBe(false)

        const { result: thirdSession } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(thirdSession.current.canVote).toBe(false))

        const { result: fourthSession } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(fourthSession.current.canVote).toBe(false))
    })

    test('Different contestants have separate vote states', async () => {
        const contestant1 = 'contestant-1'
        const contestant2 = 'contestant-2'

        const { result: hook1 } = renderHook(() => useVoting(contestant1))
        const { result: hook2 } = renderHook(() => useVoting(contestant2))
        await waitFor(() => {
            expect(hook1.current.votesUsed).toBe(0)
            expect(hook2.current.votesUsed).toBe(0)
        })

        await act(async () => {
            const votePromise = hook1.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            await votePromise
        })

        expect(hook1.current.votesUsed).toBe(1)
        expect(hook2.current.votesUsed).toBe(0)

        for (let i = 1; i < VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT; i++) {
            await act(async () => {
                const votePromise = hook1.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
                await votePromise
            })
        }

        expect(hook1.current.canVote).toBe(false)
        expect(hook2.current.canVote).toBe(true)

        const { result: reloadedHook1 } = renderHook(() => useVoting(contestant1))
        const { result: reloadedHook2 } = renderHook(() => useVoting(contestant2))
        await waitFor(() => {
            expect(reloadedHook1.current.canVote).toBe(false)
            expect(reloadedHook2.current.canVote).toBe(true)
        })
    })

    test('localStorage error handling does not break voting functionality', () => {
        mockLocalStorage.getItem.mockImplementationOnce(() => {
            throw new Error('localStorage unavailable')
        })

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        const { result } = renderHook(() => useVoting(contestantId))
        expect(result.current.votesUsed).toBe(0)
        expect(result.current.canVote).toBe(true)
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })

    test('Vote submission failure does not update localStorage', async () => {
        mockMathRandom.mockReturnValue(0.15) // Force failure

        const { result } = renderHook(() => useVoting(contestantId))
        await waitFor(() => expect(result.current.canVote).not.toBeUndefined())

        await act(async () => {
            const votePromise = result.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            await votePromise
        })

        expect(result.current.votesUsed).toBe(0)
        expect(result.current.canVote).toBe(true)
        expect(result.current.voteMessage).toContain('failed')
        expect(mockLocalStorage.store[storageKey]).toBeUndefined()
    })
})
