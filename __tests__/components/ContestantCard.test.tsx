// __tests__/components/ContestantCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ContestantCard } from "@/components/ContestantCard";
import type { Contestant, VotingWindow } from "@/types";
import { VoteButton } from "@/components/VoteButton";

// Mock the VoteButton component
jest.mock("@/components/VoteButton", () => ({
  VoteButton: ({ contestant }: { contestant: Contestant }) => (
    <div data-testid="vote-button">Mock Vote Button for {contestant.name}</div>
  ),
}));

const mockContestant: Contestant = {
  id: "test-1",
  name: "Sarah Chen",
  category: "Singer",
  image: "https://example.com/image.jpg",
  votes: 1247,
  description: "A soulful singer with a powerful voice",
};

const mockVotingWindow: VotingWindow & { formattedTime: string } = {
  isActive: true,
  startTime: Date.now() - 5000,
  endTime: Date.now() + 300000,
  remainingTime: 295000,
  formattedTime: "4:55",
};

describe("ContestantCard", () => {
  test("renders contestant information correctly", () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        votingWindow={mockVotingWindow}
      />
    );

    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Singer")).toBeInTheDocument();
    expect(
      screen.getByText("A soulful singer with a powerful voice")
    ).toBeInTheDocument();
    expect(screen.getByAltText("Sarah Chen")).toBeInTheDocument();
  });

  test("renders vote button", () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        votingWindow={mockVotingWindow}
      />
    );

    expect(screen.getByTestId("vote-button")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Vote Button for Sarah Chen")
    ).toBeInTheDocument();
  });

  test("displays vote count", () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        votingWindow={mockVotingWindow}
      />
    );

    expect(screen.getByText("🏆 1,247")).toBeInTheDocument();
  });
});
