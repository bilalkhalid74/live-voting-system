import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { VOTING_CONFIG } from '@/utils/constants';
import type { VoteState, UseVotingReturn } from '@/types';

export function useVoting(contestantId: string): UseVotingReturn {
    const [voteState, setVoteState] = useLocalStorage<VoteState>(`vote_${contestantId}`, {
        contestantId,
        votesUsed: 0,
        maxVotes: VOTING_CONFIG.MAX_VOTES_PER_CONTESTANT,
        lastVoteTime: null
    });

    const [isVoting, setIsVoting] = useState(false);
    const [voteMessage, setVoteMessage] = useState('');

    const canVote = voteState.votesUsed < voteState.maxVotes;
    const remainingVotes = voteState.maxVotes - voteState.votesUsed;

    const vote = useCallback(async () => {
        if (!canVote || isVoting) return;

        setIsVoting(true);
        setVoteMessage('');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, VOTING_CONFIG.VOTE_SUBMISSION_DELAY));

            // Simulate occasional failures
            if (Math.random() < VOTING_CONFIG.FAILURE_RATE) {
                throw new Error('Vote submission failed. Please try again.');
            }

            setVoteState(prev => ({
                ...prev,
                votesUsed: prev.votesUsed + 1,
                lastVoteTime: Date.now()
            }));

            setVoteMessage('Vote submitted successfully! ✓');
            setTimeout(() => setVoteMessage(''), 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setVoteMessage(errorMessage);
            setTimeout(() => setVoteMessage(''), 5000);
        } finally {
            setIsVoting(false);
        }
    }, [canVote, isVoting, setVoteState]);

    return {
        votesUsed: voteState.votesUsed,
        maxVotes: voteState.maxVotes,
        remainingVotes,
        canVote,
        isVoting,
        voteMessage,
        vote
    };
}