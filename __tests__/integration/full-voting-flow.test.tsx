// __tests__/integration/full-voting-flow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock all the hooks to have controlled behavior
jest.mock("@/hooks/useContestants");
jest.mock("@/hooks/useVotingWindow");
jest.mock("@/hooks/useRealTimeUpdates");
jest.mock("@/hooks/useVoting");

import { useContestants } from "@/hooks/useContestants";
import { useVotingWindow } from "@/hooks/useVotingWindow";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useVoting } from "@/hooks/useVoting";

const mockUseContestants = useContestants as jest.MockedFunction<
  typeof useContestants
>;
const mockUseVotingWindow = useVotingWindow as jest.MockedFunction<
  typeof useVotingWindow
>;
const mockUseRealTimeUpdates = useRealTimeUpdates as jest.MockedFunction<
  typeof useRealTimeUpdates
>;
const mockUseVoting = useVoting as jest.MockedFunction<typeof useVoting>;

const mockContestants = [
  {
    id: "1",
    name: "Test Contestant 1",
    category: "Singer",
    image: "test1.jpg",
    votes: 100,
    description: "Test description 1",
  },
  {
    id: "2",
    name: "Test Contestant 2",
    category: "Dancer",
    image: "test2.jpg",
    votes: 200,
    description: "Test description 2",
  },
];

describe("Full Voting Flow Integration", () => {
  beforeEach(() => {
    mockUseContestants.mockReturnValue({
      contestants: mockContestants,
      setContestants: jest.fn(),
    });

    mockUseVotingWindow.mockReturnValue({
      isActive: true,
      startTime: Date.now() - 5000,
      endTime: Date.now() + 300000,
      remainingTime: 295000,
      formattedTime: "4:55",
    });

    mockUseRealTimeUpdates.mockReturnValue({
      isUpdating: false,
    });

    mockUseVoting.mockReturnValue({
      votesUsed: 0,
      maxVotes: 3,
      remainingVotes: 3,
      canVote: true,
      isVoting: false,
      voteMessage: "",
      vote: jest.fn(),
    });
  });

  test("renders complete voting interface", () => {
    render(<HomePage />);

    // Check header
    expect(
      screen.getByText(/America's Got Talent - Live Voting/)
    ).toBeInTheDocument();

    // Check voting status
    expect(screen.getByText("🔴 LIVE VOTING")).toBeInTheDocument();
    expect(screen.getByText("Time remaining: 4:55")).toBeInTheDocument();

    // Check contestants
    expect(screen.getByText("Test Contestant 1")).toBeInTheDocument();
    expect(screen.getByText("Test Contestant 2")).toBeInTheDocument();

    // Check vote buttons
    const voteButtons = screen.getAllByText(/❤️ Vote/);
    expect(voteButtons).toHaveLength(2);
  });

  test("handles voting window closed state", () => {
    mockUseVotingWindow.mockReturnValue({
      isActive: false,
      startTime: Date.now() - 300000,
      endTime: Date.now() - 5000,
      remainingTime: 0,
      formattedTime: "0:00",
    });

    render(<HomePage />);

    expect(screen.getByText("⏸️ VOTING CLOSED")).toBeInTheDocument();
    expect(
      screen.getByText("Voting has ended for this round")
    ).toBeInTheDocument();
  });

  test("shows live updates indicator", () => {
    mockUseRealTimeUpdates.mockReturnValue({
      isUpdating: true,
    });

    render(<HomePage />);

    expect(screen.getByText("🔄 Live updates...")).toBeInTheDocument();
  });

  test("error boundary catches component errors", () => {
    // Mock useVoting to throw an error for one contestant
    mockUseVoting
      .mockReturnValueOnce({
        votesUsed: 0,
        maxVotes: 3,
        remainingVotes: 3,
        canVote: true,
        isVoting: false,
        voteMessage: "",
        vote: jest.fn(),
      })
      .mockImplementationOnce(() => {
        throw new Error("Test error");
      });

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(<HomePage />);

    // Should still render the page with one working contestant and one error boundary
    expect(screen.getByText("Test Contestant 1")).toBeInTheDocument();

    console.error = originalError;
  });
});
