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
        // Ensure votes succeed by default (no failures)
        mockMathRandom.mockReturnValue(0.05) // Below failure rate of 0.1
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('CRITICAL: Vote button disables after voting and remains disabled after page reload', async () => {
        // === PHASE 1: Initial state ===
        const { result: initialResult } = renderHook(() => useVoting(contestantId))

        expect(initialResult.current.canVote).toBe(true)
        expect(initialResult.current.votesUsed).toBe(0)
        expect(initialResult.current.remainingVotes).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT)

        // === PHASE 2: Cast a vote ===
        await act(async () => {
            await initialResult.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
        })

        // Verify vote was registered
        expect(initialResult.current.votesUsed).toBe(1)
        expect(initialResult.current.remainingVotes).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT - 1)
        expect(initialResult.current.canVote).toBe(true) // Still can vote (hasn't reached max)

        // Verify localStorage was updated
        const storedData = JSON.parse(mockLocalStorage.store[storageKey])
        expect(storedData.votesUsed).toBe(1)
        expect(storedData.contestantId).toBe(contestantId)
        expect(storedData.lastVoteTime).toBeTruthy()

        // === PHASE 3: Cast remaining votes to reach maximum ===
        for (let i = 1; i < VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT; i++) {
            await act(async () => {
                await initialResult.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            })
        }

        // Verify button is now disabled after reaching max votes
        expect(initialResult.current.votesUsed).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT)
        expect(initialResult.current.remainingVotes).toBe(0)
        expect(initialResult.current.canVote).toBe(false)

        // === PHASE 4: Simulate page reload by creating new hook instance ===
        const { result: reloadedResult } = renderHook(() => useVoting(contestantId))

        // CRITICAL TEST: Button should remain disabled after reload
        expect(reloadedResult.current.canVote).toBe(false)
        expect(reloadedResult.current.votesUsed).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT)
        expect(reloadedResult.current.remainingVotes).toBe(0)

        // === PHASE 5: Verify localStorage persistence ===
        const persistedData = JSON.parse(mockLocalStorage.store[storageKey])
        expect(persistedData.votesUsed).toBe(VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT)
        expect(persistedData.contestantId).toBe(contestantId)

        // === PHASE 6: Attempt to vote when disabled (should not work) ===
        const initialVoteCount = reloadedResult.current.votesUsed

        await act(async () => {
            await reloadedResult.current.vote() // This should not do anything
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
        })

        // Vote count should not change
        expect(reloadedResult.current.votesUsed).toBe(initialVoteCount)
        expect(reloadedResult.current.canVote).toBe(false)
    })

    test('Vote state persists correctly across multiple page reloads', async () => {
        // Create initial hook and cast 2 votes
        const { result: firstSession } = renderHook(() => useVoting(contestantId))

        for (let i = 0; i < 2; i++) {
            await act(async () => {
                await firstSession.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            })
        }

        expect(firstSession.current.votesUsed).toBe(2)
        expect(firstSession.current.canVote).toBe(true)

        // Simulate first reload
        const { result: secondSession } = renderHook(() => useVoting(contestantId))
        expect(secondSession.current.votesUsed).toBe(2)
        expect(secondSession.current.canVote).toBe(true)

        // Cast final vote in second session
        await act(async () => {
            await secondSession.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
        })

        expect(secondSession.current.votesUsed).toBe(3)
        expect(secondSession.current.canVote).toBe(false)

        // Simulate second reload
        const { result: thirdSession } = renderHook(() => useVoting(contestantId))
        expect(thirdSession.current.votesUsed).toBe(3)
        expect(thirdSession.current.canVote).toBe(false)

        // Simulate third reload to be extra sure
        const { result: fourthSession } = renderHook(() => useVoting(contestantId))
        expect(fourthSession.current.votesUsed).toBe(3)
        expect(fourthSession.current.canVote).toBe(false)
    })

    test('Different contestants have separate vote states', async () => {
        const contestant1 = 'contestant-1'
        const contestant2 = 'contestant-2'

        const { result: hook1 } = renderHook(() => useVoting(contestant1))
        const { result: hook2 } = renderHook(() => useVoting(contestant2))

        // Both should start fresh
        expect(hook1.current.canVote).toBe(true)
        expect(hook2.current.canVote).toBe(true)
        expect(hook1.current.votesUsed).toBe(0)
        expect(hook2.current.votesUsed).toBe(0)

        // Vote for contestant 1 only
        await act(async () => {
            await hook1.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
        })

        // Only contestant 1's state should change
        expect(hook1.current.votesUsed).toBe(1)
        expect(hook2.current.votesUsed).toBe(0)

        // Max out votes for contestant 1
        for (let i = 1; i < VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT; i++) {
            await act(async () => {
                await hook1.current.vote()
                jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
            })
        }

        expect(hook1.current.canVote).toBe(false)
        expect(hook2.current.canVote).toBe(true)

        // Simulate page reload
        const { result: reloadedHook1 } = renderHook(() => useVoting(contestant1))
        const { result: reloadedHook2 } = renderHook(() => useVoting(contestant2))

        expect(reloadedHook1.current.canVote).toBe(false)
        expect(reloadedHook2.current.canVote).toBe(true)
    })

    test('localStorage error handling does not break voting functionality', () => {
        // Simulate localStorage.getItem throwing an error
        mockLocalStorage.getItem.mockImplementationOnce(() => {
            throw new Error('localStorage unavailable')
        })

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        const { result } = renderHook(() => useVoting(contestantId))

        // Should fallback to initial state
        expect(result.current.votesUsed).toBe(0)
        expect(result.current.canVote).toBe(true)
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })

    test('Vote submission failure does not update localStorage', async () => {
        // Force vote to fail
        mockMathRandom.mockReturnValue(0.15) // Above failure rate of 0.1

        const { result } = renderHook(() => useVoting(contestantId))

        await act(async () => {
            await result.current.vote()
            jest.advanceTimersByTime(VOTING_CONFIG.VOTE_SUBMISSION_DELAY)
        })

        // State should not change on failure
        expect(result.current.votesUsed).toBe(0)
        expect(result.current.canVote).toBe(true)
        expect(result.current.voteMessage).toContain('failed')

        // localStorage should not be updated
        expect(mockLocalStorage.store[storageKey]).toBeUndefined()
    })
})