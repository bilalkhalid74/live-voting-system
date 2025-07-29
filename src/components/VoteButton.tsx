"use client";

import React, { useCallback } from "react";
import { useVoting } from "@/hooks/useVoting";
import type { Contestant, VotingWindow } from "@/types";

interface VoteButtonProps {
  contestant: Contestant;
  votingWindow: VotingWindow;
}

export const VoteButton: React.FC<VoteButtonProps> = React.memo(
  ({ contestant, votingWindow }) => {
    const {
      votesUsed,
      maxVotes,
      remainingVotes,
      canVote,
      isVoting,
      voteMessage,
      vote,
    } = useVoting(contestant.id);

    const isDisabled = !votingWindow.isActive || !canVote || isVoting;

    const handleVote = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isDisabled) {
          vote();
        }
      },
      [isDisabled, vote]
    );

    return (
      <div className="vote-section flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1">
          <button
            className={`w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px] ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
            onClick={handleVote}
            disabled={isDisabled}
            aria-label={`Vote for ${contestant.name}`}
          >
            {isVoting ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Voting...
              </>
            ) : (
              <>❤️ Vote ({remainingVotes} left)</>
            )}
          </button>

          <div className="text-sm text-gray-600 mt-2">
            You&apos;ve used {votesUsed} of {maxVotes} votes
          </div>

          {voteMessage && (
            <div
              className={`mt-2 p-2 rounded text-sm ${
                voteMessage.includes("✓")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {voteMessage}
            </div>
          )}
        </div>

        <div className="vote-count text-2xl font-bold text-blue-600 flex items-center gap-1">
          🏆 {contestant.votes.toLocaleString()}
        </div>
      </div>
    );
  }
);

VoteButton.displayName = "VoteButton";
