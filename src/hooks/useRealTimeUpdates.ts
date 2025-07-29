import { useEffect, useState } from 'react';
import { VOTING_CONFIG } from '@/utils/constants';
import type { Contestant } from '@/types';

export function useRealTimeUpdates(
    contestants: Contestant[],
    setContestants: React.Dispatch<React.SetStateAction<Contestant[]>>
) {
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsUpdating(true);

            // Simulate real-time vote updates
            setContestants(prev =>
                prev.map(contestant => ({
                    ...contestant,
                    votes: contestant.votes + Math.floor(Math.random() * 5)
                }))
            );

            setTimeout(() => setIsUpdating(false), 500);
        }, VOTING_CONFIG.UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [setContestants]);

    return { isUpdating };
}