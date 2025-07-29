import { useState, useEffect } from 'react';
import { VOTING_CONFIG } from '@/utils/constants';
import type { VotingWindow } from '@/types';

export function useVotingWindow() {
    const [votingWindow, setVotingWindow] = useState<VotingWindow>({
        isActive: true,
        startTime: Date.now() - 5000,
        endTime: Date.now() + VOTING_CONFIG.VOTING_DURATION,
        remainingTime: VOTING_CONFIG.VOTING_DURATION
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = votingWindow.endTime - now;

            if (remaining <= 0) {
                setVotingWindow(prev => ({
                    ...prev,
                    isActive: false,
                    remainingTime: 0
                }));
            } else {
                setVotingWindow(prev => ({
                    ...prev,
                    remainingTime: remaining
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [votingWindow.endTime]);

    const formatTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
        ...votingWindow,
        formattedTime: formatTime(votingWindow.remainingTime)
    };
}