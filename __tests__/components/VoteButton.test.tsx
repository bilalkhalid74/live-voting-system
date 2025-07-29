// __tests__/components/VoteButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VoteButton } from "@/components/VoteButton";
import { useVoting } from "@/hooks/useVoting";
import type { Contestant, VotingWindow } from "@/types";

// Mock the useVoting hook
jest.mock("@/hooks/useVoting");
const mockUseVoting = useVoting as jest.MockedFunction<typeof useVoting>;

const mockContestant: Contestant = {
  id: "test-1",
  name: "Test Contestant",
  category: "Singer",
  image: "test-image.jpg",
  votes: 100,
  description: "Test description",
};

const activeVotingWindow: VotingWindow = {
  isActive: true,
  startTime: Date.now() - 5000,
  endTime: Date.now() + 300000,
  remainingTime: 295000,
};

const inactiveVotingWindow: VotingWindow = {
  isActive: false,
  startTime: Date.now() - 300000,
  endTime: Date.now() - 5000,
  remainingTime: 0,
};

describe("VoteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders vote button with correct initial state", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 0,
      maxVotes: 3,
      remainingVotes: 3,
      canVote: true,
      isVoting: false,
      voteMessage: "",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    expect(screen.getByText("❤️ Vote (3 left)")).toBeInTheDocument();
    expect(screen.getByText("You've used 0 of 3 votes")).toBeInTheDocument();
  });

  test("button is disabled when voting window is inactive", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 0,
      maxVotes: 3,
      remainingVotes: 3,
      canVote: true,
      isVoting: false,
      voteMessage: "",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={inactiveVotingWindow}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("button is disabled when max votes reached", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 3,
      maxVotes: 3,
      remainingVotes: 0,
      canVote: false,
      isVoting: false,
      voteMessage: "",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText("❤️ Vote (0 left)")).toBeInTheDocument();
  });

  test("shows loading state when voting", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 1,
      maxVotes: 3,
      remainingVotes: 2,
      canVote: true,
      isVoting: true,
      voteMessage: "",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    expect(screen.getByText("Voting...")).toBeInTheDocument();
  });

  test("calls vote function when button is clicked", async () => {
    const mockVote = jest.fn();
    mockUseVoting.mockReturnValue({
      votesUsed: 0,
      maxVotes: 3,
      remainingVotes: 3,
      canVote: true,
      isVoting: false,
      voteMessage: "",
      vote: mockVote,
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockVote).toHaveBeenCalledTimes(1);
  });

  test("displays success message", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 1,
      maxVotes: 3,
      remainingVotes: 2,
      canVote: true,
      isVoting: false,
      voteMessage: "Vote submitted successfully! ✓",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    expect(
      screen.getByText("Vote submitted successfully! ✓")
    ).toBeInTheDocument();
  });

  test("displays error message", () => {
    mockUseVoting.mockReturnValue({
      votesUsed: 0,
      maxVotes: 3,
      remainingVotes: 3,
      canVote: true,
      isVoting: false,
      voteMessage: "Vote submission failed. Please try again.",
      vote: jest.fn(),
    });

    render(
      <VoteButton
        contestant={mockContestant}
        votingWindow={activeVotingWindow}
      />
    );

    expect(
      screen.getByText("Vote submission failed. Please try again.")
    ).toBeInTheDocument();
  });
});
