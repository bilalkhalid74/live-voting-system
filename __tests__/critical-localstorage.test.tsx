// __tests__/critical-localstorage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import HomePage from "@/app/page";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    // Add a way to manually set store for testing
    __setStore: (newStore: Record<string, string>) => {
      store = { ...newStore };
    },
    __getStore: () => ({ ...store }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock the hooks to avoid circular dependencies
jest.mock("@/hooks/useContestants", () => ({
  useContestants: () => ({
    contestants: [
      {
        id: "1",
        name: "Sarah Chen",
        category: "Singer",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616c6d99de4?w=400&h=300&fit=crop",
        votes: 1247,
        description:
          "A soulful singer with a powerful voice that moves audiences to tears.",
      },
      {
        id: "2",
        name: "Marcus Rodriguez",
        category: "Dancer",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        votes: 892,
        description:
          "An innovative dancer blending street dance with classical ballet.",
      },
    ],
    setContestants: jest.fn(),
  }),
}));

jest.mock("@/hooks/useVotingWindow", () => ({
  useVotingWindow: () => ({
    isActive: true,
    startTime: Date.now() - 5000,
    endTime: Date.now() + 300000,
    remainingTime: 300000,
    formattedTime: "5:00",
  }),
}));

jest.mock("@/hooks/useRealTimeUpdates", () => ({
  useRealTimeUpdates: () => ({
    isUpdating: false,
  }),
}));

describe("Critical localStorage Vote Persistence Test", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Vote button disables after voting and remains disabled after page reload", async () => {
    // Initial render
    const { rerender } = render(<HomePage />);

    // Wait for components to load
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    });

    // Find the vote button for Sarah Chen (contestant id '1')
    const voteButtons = screen.getAllByRole("button", { name: /vote for/i });
    const sarahVoteButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );

    expect(sarahVoteButton).toBeInTheDocument();
    expect(sarahVoteButton).toBeEnabled();
    expect(sarahVoteButton).toHaveTextContent("❤️ Vote (3 left)");

    // Cast a vote
    await act(async () => {
      fireEvent.click(sarahVoteButton!);
    });

    // Wait for the vote to process
    await waitFor(
      () => {
        expect(sarahVoteButton).toHaveTextContent("❤️ Vote (2 left)");
      },
      { timeout: 3000 }
    );

    // Verify localStorage was updated with the vote state
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "vote_1",
      expect.stringContaining('"votesUsed":1')
    );

    // Simulate page reload by re-rendering the component
    // First, let's check what's in localStorage
    const storedVoteState = mockLocalStorage.__getStore()["vote_1"];
    expect(storedVoteState).toBeDefined();

    // Re-render to simulate page reload
    rerender(<HomePage />);

    // Wait for components to load again
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    });

    // Check that the vote button reflects the previous vote state
    const reloadedVoteButtons = screen.getAllByRole("button", {
      name: /vote for/i,
    });
    const reloadedSarahButton = reloadedVoteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );

    expect(reloadedSarahButton).toBeInTheDocument();
    // Should show 2 votes remaining instead of 3
    expect(reloadedSarahButton).toHaveTextContent("❤️ Vote (2 left)");

    // Verify localStorage was read on component mount
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("vote_1");
  });

  test("Multiple contestants vote states persist correctly across page reloads", async () => {
    // Initial render
    const { rerender } = render(<HomePage />);

    // Wait for contestants to load
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
      expect(screen.getByText("Marcus Rodriguez")).toBeInTheDocument();
    });

    // Get vote buttons for both contestants
    const voteButtons = screen.getAllByRole("button", { name: /vote for/i });
    const sarahButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );
    const marcusButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Marcus Rodriguez")
    );

    expect(sarahButton).toBeInTheDocument();
    expect(marcusButton).toBeInTheDocument();

    // Vote for Sarah twice
    await act(async () => {
      fireEvent.click(sarahButton!);
    });

    await waitFor(() => {
      expect(sarahButton).toHaveTextContent("❤️ Vote (2 left)");
    });

    await act(async () => {
      fireEvent.click(sarahButton!);
    });

    await waitFor(() => {
      expect(sarahButton).toHaveTextContent("❤️ Vote (1 left)");
    });

    // Vote for Marcus once
    await act(async () => {
      fireEvent.click(marcusButton!);
    });

    await waitFor(() => {
      expect(marcusButton).toHaveTextContent("❤️ Vote (2 left)");
    });

    // Verify localStorage contains both vote states
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "vote_1",
      expect.stringContaining('"votesUsed":2')
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "vote_2",
      expect.stringContaining('"votesUsed":1')
    );

    // Simulate page reload
    rerender(<HomePage />);

    // Wait for contestants to load again
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
      expect(screen.getByText("Marcus Rodriguez")).toBeInTheDocument();
    });

    // Check that both vote states are preserved
    const reloadedButtons = screen.getAllByRole("button", {
      name: /vote for/i,
    });
    const reloadedSarahButton = reloadedButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );
    const reloadedMarcusButton = reloadedButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Marcus Rodriguez")
    );

    expect(reloadedSarahButton).toHaveTextContent("❤️ Vote (1 left)"); // 2 votes used
    expect(reloadedMarcusButton).toHaveTextContent("❤️ Vote (2 left)"); // 1 vote used
  });

  test("Vote button becomes completely disabled when max votes reached", async () => {
    // Pre-populate localStorage with max votes for contestant 1
    const maxVotesState = {
      contestantId: "1",
      votesUsed: 3,
      maxVotes: 3,
      lastVoteTime: Date.now(),
    };
    mockLocalStorage.__setStore({
      vote_1: JSON.stringify(maxVotesState),
    });

    // Render component
    render(<HomePage />);

    // Wait for contestants to load
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    });

    // Find Sarah's vote button
    const voteButtons = screen.getAllByRole("button", { name: /vote for/i });
    const sarahButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );

    // Button should be disabled and show 0 votes left
    expect(sarahButton).toBeInTheDocument();
    expect(sarahButton).toBeDisabled();
    expect(sarahButton).toHaveTextContent("❤️ Vote (0 left)");

    // Verify localStorage was read
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("vote_1");
  });

  test("Vote states are isolated per contestant", async () => {
    // Pre-populate localStorage with different vote states
    mockLocalStorage.__setStore({
      vote_1: JSON.stringify({
        contestantId: "1",
        votesUsed: 3,
        maxVotes: 3,
        lastVoteTime: Date.now(),
      }),
      vote_2: JSON.stringify({
        contestantId: "2",
        votesUsed: 0,
        maxVotes: 3,
        lastVoteTime: null,
      }),
    });

    render(<HomePage />);

    // Wait for contestants to load
    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
      expect(screen.getByText("Marcus Rodriguez")).toBeInTheDocument();
    });

    const voteButtons = screen.getAllByRole("button", { name: /vote for/i });
    const sarahButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Sarah Chen")
    );
    const marcusButton = voteButtons.find((button) =>
      button.getAttribute("aria-label")?.includes("Marcus Rodriguez")
    );

    // Sarah should be disabled (max votes reached)
    expect(sarahButton).toBeDisabled();
    expect(sarahButton).toHaveTextContent("❤️ Vote (0 left)");

    // Marcus should be enabled (no votes used)
    expect(marcusButton).toBeEnabled();
    expect(marcusButton).toHaveTextContent("❤️ Vote (3 left)");
  });
});
