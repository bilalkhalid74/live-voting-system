"use client";

import React from "react";
import type { VotingWindow } from "@/types";

interface VotingStatusProps {
  votingWindow: VotingWindow & { formattedTime: string };
}

export const VotingStatus: React.FC<VotingStatusProps> = ({ votingWindow }) => (
  <div
    className={`voting-status rounded-2xl p-6 mb-8 text-center text-white backdrop-blur-md border ${
      votingWindow.isActive
        ? "bg-green-500/20 border-green-400/50"
        : "bg-red-500/20 border-red-400/50"
    }`}
  >
    <h2 className="text-2xl font-bold mb-2">
      {votingWindow.isActive ? "🔴 LIVE VOTING" : "⏸️ VOTING CLOSED"}
    </h2>
    <p className="text-lg mb-2">
      {votingWindow.isActive
        ? "Cast your votes now!"
        : "Voting has ended for this round"}
    </p>
    {votingWindow.isActive && (
      <div className="timer text-3xl font-bold">
        Time remaining: {votingWindow.formattedTime}
      </div>
    )}
  </div>
);
