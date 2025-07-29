import { useState } from 'react';
import { INITIAL_CONTESTANTS } from '@/utils/constants';
import type { Contestant } from '@/types';

export function useContestants() {
    const [contestants, setContestants] = useState<Contestant[]>(INITIAL_CONTESTANTS);

    return { contestants, setContestants };
}