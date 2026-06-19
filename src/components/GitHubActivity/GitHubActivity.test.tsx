import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import GitHubActivity from "./GitHubActivity";

jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

const makePushEvent = (overrides: Record<string, unknown> = {}) => ({
  id: "1",
  type: "PushEvent",
  created_at: new Date(Date.now() - 60000).toISOString(),
  repo: {
    name: "dennislo/my-repo",
    url: "https://api.github.com/repos/dennislo/my-repo",
  },
  payload: {
    ref: "refs/heads/main",
    commits: [{ message: "fix: update deps" }, { message: "chore: lint" }],
  },
  ...overrides,
});

const makePREvent = () => ({
  id: "2",
  type: "PullRequestEvent",
  created_at: new Date(Date.now() - 3600000).toISOString(),
  repo: {
    name: "dennislo/portfolio",
    url: "https://api.github.com/repos/dennislo/portfolio",
  },
  payload: {
    action: "opened",
    pull_request: { number: 42, title: "Add dark mode", merged: false },
  },
});

const makeWatchEvent = () => ({
  id: "3",
  type: "WatchEvent",
  created_at: new Date(Date.now() - 86400000).toISOString(),
  repo: {
    name: "dennislo/starred-repo",
    url: "https://api.github.com/repos/dennislo/starred-repo",
  },
  payload: { action: "started" },
});

const makeIssuesEvent = () => ({
  id: "4",
  type: "IssuesEvent",
  created_at: new Date(Date.now() - 7200000).toISOString(),
  repo: {
    name: "dennislo/issues-repo",
    url: "https://api.github.com/repos/dennislo/issues-repo",
  },
  payload: {
    action: "opened",
    issue: { number: 7, title: "Bug in dark mode" },
  },
});

const makeCreateEvent = () => ({
  id: "5",
  type: "CreateEvent",
  created_at: new Date(Date.now() - 10800000).toISOString(),
  repo: {
    name: "dennislo/new-project",
    url: "https://api.github.com/repos/dennislo/new-project",
  },
  payload: { ref_type: "branch", ref: "feature/cool-thing" },
});

const makeForkEvent = () => ({
  id: "6",
  type: "ForkEvent",
  created_at: new Date(Date.now() - 14400000).toISOString(),
  repo: {
    name: "dennislo/forked-repo",
    url: "https://api.github.com/repos/dennislo/forked-repo",
  },
  payload: {},
});

const makeUnknownEvent = () => ({
  id: "7",
  type: "SomeObscureEvent",
  created_at: new Date(Date.now() - 18000000).toISOString(),
  repo: {
    name: "dennislo/misc-repo",
    url: "https://api.github.com/repos/dennislo/misc-repo",
  },
  payload: {},
});

const mockFetch = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  global.fetch = mockFetch;
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => [makePushEvent(), makePREvent(), makeWatchEvent()],
  } as Response);
});

afterEach(() => {
  jest.useRealTimers();
  mockFetch.mockReset();
});

describe("GitHubActivity", () => {
  it('renders the "Activity" heading', async () => {
    render(<GitHubActivity />);
    expect(
      screen.getByRole("heading", { name: "Activity" }),
    ).toBeInTheDocument();
  });

  it("shows skeleton placeholders while loading", () => {
    render(<GitHubActivity />);
    expect(
      screen.getByRole("list", { name: "Loading GitHub activity" }),
    ).toBeInTheDocument();
  });

  it("renders event rows after fetch resolves", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: "Recent GitHub activity" }),
      ).toBeInTheDocument();
    });
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("renders the push event label with commit count and branch", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      expect(screen.getByText(/Pushed 2 commits to main/)).toBeInTheDocument();
    });
  });

  it("renders the PR event label with number and title", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Opened PR #42: Add dark mode/),
      ).toBeInTheDocument();
    });
  });

  it("renders the WatchEvent as 'Starred'", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      expect(screen.getByText(/Starred/)).toBeInTheDocument();
    });
  });

  it("links repo names to the correct GitHub URL", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      const repoLink = screen.getByRole("link", { name: "dennislo/my-repo" });
      expect(repoLink).toHaveAttribute(
        "href",
        "https://github.com/dennislo/my-repo",
      );
    });
  });

  it("renders the 'View all activity' footer link pointing to the github profile", async () => {
    render(<GitHubActivity />);
    const footerLink = screen.getByRole("link", {
      name: /View all activity on GitHub/,
    });
    expect(footerLink).toHaveAttribute("href", "https://github.com/dennislo");
  });

  it("shows error state when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Couldn't load recent activity/),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: "View on GitHub" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when API returns no events", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText("No recent public activity."),
      ).toBeInTheDocument();
    });
  });

  it("shows at most 8 events even when API returns more", async () => {
    const manyEvents = Array.from({ length: 15 }, (_, i) =>
      makePushEvent({ id: String(i + 1) }),
    );
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => manyEvents,
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: "Recent GitHub activity" }),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });

  it("refetches after 5 minutes via setInterval", async () => {
    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: "Recent GitHub activity" }),
      ).toBeInTheDocument();
    });

    const callsBefore = mockFetch.mock.calls.length;
    jest.advanceTimersByTime(300000);

    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  it("renders the IssuesEvent label with number and title", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [makeIssuesEvent()],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Opened issue #7: Bug in dark mode/),
      ).toBeInTheDocument();
    });
  });

  it("renders the CreateEvent label with ref_type and ref", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [makeCreateEvent()],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Created branch feature\/cool-thing/),
      ).toBeInTheDocument();
    });
  });

  it("renders the ForkEvent label as 'Forked'", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [makeForkEvent()],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(screen.getByText(/Forked/)).toBeInTheDocument();
    });
  });

  it("renders an unknown event type as 'Activity'", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [makeUnknownEvent()],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(screen.getByText(/Activity/)).toBeInTheDocument();
    });
  });

  it("renders a closed PR event as 'Closed'", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "8",
          type: "PullRequestEvent",
          created_at: new Date(Date.now() - 600000).toISOString(),
          repo: {
            name: "dennislo/repo",
            url: "https://api.github.com/repos/dennislo/repo",
          },
          payload: {
            action: "closed",
            pull_request: {
              number: 10,
              title: "Remove old code",
              merged: false,
            },
          },
        },
      ],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Closed PR #10: Remove old code/),
      ).toBeInTheDocument();
    });
  });

  it("renders a merged PR event as 'Merged'", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "9",
          type: "PullRequestEvent",
          created_at: new Date(Date.now() - 600000).toISOString(),
          repo: {
            name: "dennislo/repo",
            url: "https://api.github.com/repos/dennislo/repo",
          },
          payload: {
            action: "closed",
            pull_request: {
              number: 11,
              title: "Ship the feature",
              merged: true,
            },
          },
        },
      ],
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Merged PR #11: Ship the feature/),
      ).toBeInTheDocument();
    });
  });

  it("shows error state when fetch returns a non-ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: "Forbidden" }),
    } as Response);

    render(<GitHubActivity />);
    await waitFor(() => {
      expect(
        screen.getByText(/Couldn't load recent activity/),
      ).toBeInTheDocument();
    });
  });
});
