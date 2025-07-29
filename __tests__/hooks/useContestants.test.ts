// __tests__/hooks/useContestants.test.ts
import { renderHook, act } from '@testing-library/react'
import { useContestants } from '@/hooks/useContestants'
import { INITIAL_CONTESTANTS } from '@/utils/constants'

describe('useContestants', () => {
  test('returns initial contestants', () => {
    const { result } = renderHook(() => useContestants())

    expect(result.current.contestants).toEqual(INITIAL_CONTESTANTS)
    expect(result.current.contestants).toHaveLength(6)
  })

  test('can update contestants', () => {
    const { result } = renderHook(() => useContestants())

    const updatedContestants = [
      ...INITIAL_CONTESTANTS,
      {
        id: 'new-1',
        name: 'New Contestant',
        category: 'Dancer',
        image: 'new-image.jpg',
        votes: 0,
        description: 'New contestant description'
      }
    ]

    act(() => {
      result.current.setContestants(updatedContestants)
    })

    expect(result.current.contestants).toEqual(updatedContestants)
    expect(result.current.contestants).toHaveLength(7)
  })
})
