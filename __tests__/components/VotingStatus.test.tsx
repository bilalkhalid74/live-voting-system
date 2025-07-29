// __tests__/components/VotingStatus.test.tsx
import { render, screen } from "@testing-library/react";
import { VotingStatus } from "@/components/VotingStatus";
import type { VotingWindow } from "@/types";

describe("VotingStatus", () => {
  test("displays active voting status", () => {
    const activeWindow: VotingWindow & { formattedTime: string } = {
      isActive: true,
      startTime: Date.now() - 5000,
      endTime: Date.now() + 300000,
      remainingTime: 295000,
      formattedTime: "4:55",
    };

    render(<VotingStatus votingWindow={activeWindow} />);

    expect(screen.getByText("🔴 LIVE VOTING")).toBeInTheDocument();
    expect(screen.getByText("Cast your votes now!")).toBeInTheDocument();
    expect(screen.getByText("Time remaining: 4:55")).toBeInTheDocument();
  });

  test("displays inactive voting status", () => {
    const inactiveWindow: VotingWindow & { formattedTime: string } = {
      isActive: false,
      startTime: Date.now() - 300000,
      endTime: Date.now() - 5000,
      remainingTime: 0,
      formattedTime: "0:00",
    };

    render(<VotingStatus votingWindow={inactiveWindow} />);

    expect(screen.getByText("⏸️ VOTING CLOSED")).toBeInTheDocument();
    expect(
      screen.getByText("Voting has ended for this round")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Time remaining/)).not.toBeInTheDocument();
  });
});
