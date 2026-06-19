import React, { useEffect, useState } from "react";
import { siteConfig } from "../../config";
import ExternalLink from "../ExternalLink/ExternalLink";

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  payload: Record<string, unknown>;
}

interface FormattedEvent {
  id: string;
  icon: React.ReactNode;
  label: string;
  repoName: string;
  repoUrl: string;
  time: string;
}

const IconPush = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="18" r="3" />
    <path d="M12 15V5" />
    <path d="M9 8l3-3 3 3" />
  </svg>
);

const IconPR = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M6 8v10" />
    <path d="M18 16V10a4 4 0 0 0-4-4h-2" />
    <path d="M10 9l-2-2 2-2" />
  </svg>
);

const IconIssue = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const IconStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCode = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function formatEvent(event: GitHubEvent): FormattedEvent {
  const repoUrl = `https://github.com/${event.repo.name}`;
  const base = {
    id: event.id,
    repoName: event.repo.name,
    repoUrl,
    time: timeAgo(event.created_at),
  };

  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload.commits;
      const count = Array.isArray(commits) ? commits.length : 1;
      const ref =
        typeof event.payload.ref === "string"
          ? event.payload.ref.replace("refs/heads/", "")
          : "main";
      return {
        ...base,
        icon: <IconPush />,
        label: `Pushed ${count} commit${count === 1 ? "" : "s"} to ${ref}`,
      };
    }
    case "PullRequestEvent": {
      const pr = event.payload.pull_request as
        | Record<string, unknown>
        | undefined;
      const action =
        typeof event.payload.action === "string"
          ? event.payload.action
          : "updated";
      const number = pr && typeof pr.number === "number" ? pr.number : "";
      const title = pr && typeof pr.title === "string" ? pr.title : "";
      const merged = event.payload.merged === true;
      const verb =
        action === "closed" ? (merged ? "merged" : "closed") : action;
      return {
        ...base,
        icon: <IconPR />,
        label: `${verb.charAt(0).toUpperCase() + verb.slice(1)} PR #${number}: ${title}`,
      };
    }
    case "IssuesEvent": {
      const issue = event.payload.issue as Record<string, unknown> | undefined;
      const action =
        typeof event.payload.action === "string"
          ? event.payload.action
          : "updated";
      const number =
        issue && typeof issue.number === "number" ? issue.number : "";
      const title = issue && typeof issue.title === "string" ? issue.title : "";
      return {
        ...base,
        icon: <IconIssue />,
        label: `${action.charAt(0).toUpperCase() + action.slice(1)} issue #${number}: ${title}`,
      };
    }
    case "CreateEvent": {
      const refType =
        typeof event.payload.ref_type === "string"
          ? event.payload.ref_type
          : "branch";
      const ref =
        typeof event.payload.ref === "string" ? event.payload.ref : "";
      return {
        ...base,
        icon: <IconCode />,
        label: `Created ${refType}${ref ? ` ${ref}` : ""}`,
      };
    }
    case "WatchEvent":
      return { ...base, icon: <IconStar />, label: "Starred" };
    case "ForkEvent":
      return { ...base, icon: <IconCode />, label: "Forked" };
    default:
      return { ...base, icon: <IconCode />, label: "Activity" };
  }
}

function useGitHubEvents(username: string): {
  events: GitHubEvent[];
  loading: boolean;
  error: boolean;
} {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      const controller = new AbortController();
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as GitHubEvent[];
        if (!cancelled) setEvents(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError" && !cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchEvents();

    const interval = setInterval(() => {
      void fetchEvents();
    }, 300000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [username]);

  return { events, loading, error };
}

const GitHubActivity = () => {
  const accent = siteConfig.accentColor;
  const username = siteConfig.social.github.replace("https://github.com/", "");
  const { events, loading, error } = useGitHubEvents(username);

  const displayed = events.slice(0, 8).map(formatEvent);

  return (
    <section
      id="github-activity"
      className="p-8 sm:p-12 md:p-16 lg:p-24 bg-white dark:bg-gray-950 scroll-mt-28"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100">
            Activity
          </h2>
          <div
            className="w-[75px] h-[5px] mt-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-md transition-all duration-300">
            {loading && (
              <ul aria-label="Loading GitHub activity" aria-busy="true">
                {[0, 1, 2].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4" />
                    </div>
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16 flex-shrink-0" />
                  </li>
                ))}
              </ul>
            )}

            {!loading && error && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Couldn&apos;t load recent activity.{" "}
                <ExternalLink
                  href={siteConfig.social.github}
                  className="font-medium hover:underline"
                  style={{ color: accent }}
                >
                  View on GitHub
                </ExternalLink>
              </p>
            )}

            {!loading && !error && displayed.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No recent public activity.
              </p>
            )}

            {!loading && !error && displayed.length > 0 && (
              <ul aria-label="Recent GitHub activity">
                {displayed.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="mt-0.5 text-[--accent]">{item.icon}</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 min-w-0 flex-1">
                      {item.label}
                      {" · "}
                      <ExternalLink
                        href={item.repoUrl}
                        className="font-medium hover:underline"
                        style={{ color: accent }}
                      >
                        {item.repoName}
                      </ExternalLink>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto pl-2 whitespace-nowrap flex-shrink-0">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <ExternalLink
              href={siteConfig.social.github}
              className="text-sm font-medium hover:underline"
              style={{ color: accent }}
            >
              View all activity on GitHub →
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubActivity;
