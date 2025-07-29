import type { Contestant } from '@/types';

export const VOTING_CONFIG = {
    MAX_VOTES_PER_CONTESTANT: 3,
    VOTE_SUBMISSION_DELAY: 500,
    FAILURE_RATE: 0.1,
    UPDATE_INTERVAL: 2000,
    VOTING_DURATION: 300000, // 5 minutes
};

export const INITIAL_CONTESTANTS: Contestant[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        category: 'Singer',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
        votes: 1247,
        description: 'A soulful singer with a powerful voice that moves audiences to tears.'
    },
    {
        id: '2',
        name: 'Marcus Rodriguez',
        category: 'Dancer',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        votes: 892,
        description: 'An innovative dancer blending street dance with classical ballet.'
    },
    {
        id: '3',
        name: 'The Amazing Duo',
        category: 'Magic Act',
        image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=300&fit=crop',
        votes: 1456,
        description: 'Mind-bending illusions that challenge the laws of physics.'
    },
    {
        id: '4',
        name: 'Emma Thompson',
        category: 'Comedian',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
        votes: 723,
        description: 'Quick-witted comedy that finds humor in everyday life.'
    },
    {
        id: '5',
        name: 'Phoenix Acrobats',
        category: 'Acrobatic Group',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        votes: 1089,
        description: 'Death-defying stunts performed with grace and precision.'
    },
    {
        id: '6',
        name: 'Melody Rivers',
        category: 'Pianist',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop',
        votes: 654,
        description: 'Classical pianist who brings new life to timeless compositions.'
    }
];