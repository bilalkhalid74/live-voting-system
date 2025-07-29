"use client";

import React from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ContestantCard } from "@/components/ContestantCard";
import { VotingStatus } from "@/components/VotingStatus";
import { useContestants } from "@/hooks/useContestants";
import { useVotingWindow } from "@/hooks/useVotingWindow";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

export default function HomePage() {
  const { contestants, setContestants } = useContestants();
  const votingWindow = useVotingWindow();
  const { isUpdating } = useRealTimeUpdates(contestants, setContestants);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorBoundary>
          <header className="text-center mb-8 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              🌟 America&apos;s Got Talent - Live Voting 🌟
            </h1>
            <p className="text-xl md:text-2xl">
              Vote for your favorite contestants during the live show!
            </p>
          </header>

          <VotingStatus votingWindow={votingWindow} />

          <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-2 gap-8 mb-8">
            {contestants.map((contestant) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                votingWindow={votingWindow}
              />
            ))}
          </div>

          <footer className="text-center text-white">
            {isUpdating && (
              <p className="text-red-300 mb-4 animate-pulse">
                🔄 Live updates...
              </p>
            )}
            <p className="text-lg">
              © 2025 Live Voting System - Built with Next.js & React
            </p>
          </footer>
        </ErrorBoundary>
      </div>
    </div>
  );
}
