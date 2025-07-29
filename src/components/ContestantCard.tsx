"use client";

import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { VoteButton } from "./VoteButton";
import type { Contestant, VotingWindow } from "@/types";

interface ContestantCardProps {
  contestant: Contestant;
  votingWindow: VotingWindow & { formattedTime: string };
}

export const ContestantCard: React.FC<ContestantCardProps> = React.memo(
  ({ contestant, votingWindow }) => (
    <ErrorBoundary>
      <div className="contestant-card bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl">
        <img
          src={contestant.image}
          alt={contestant.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
          loading="lazy"
        />

        <div className="contestant-info mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {contestant.name}
          </h3>
          <div className="text-purple-600 font-medium mb-3 italic">
            {contestant.category}
          </div>
          <p className="text-gray-600 leading-relaxed">
            {contestant.description}
          </p>
        </div>

        <VoteButton contestant={contestant} votingWindow={votingWindow} />
      </div>
    </ErrorBoundary>
  )
);

ContestantCard.displayName = "ContestantCard";
