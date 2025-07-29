export interface Contestant {
  id: string;
  name: string;
  category: string;
  image: string;
  votes: number;
  description: string;
}

export interface VoteState {
  contestantId: string;
  votesUsed: number;
  maxVotes: number;
  lastVoteTime: number | null;
}

export interface VotingWindow {
  isActive: boolean;
  startTime: number;
  endTime: number;
  remainingTime: number;
}

export interface UseVotingReturn {
  votesUsed: number;
  maxVotes: number;
  remainingVotes: number;
  canVote: boolean;
  isVoting: boolean;
  voteMessage: string;
  vote: () => Promise<void>;
}