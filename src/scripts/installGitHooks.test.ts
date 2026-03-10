/** @jest-environment node */

import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.resolve(process.cwd(), "scripts/install-git-hooks.sh");
const preCommitHookPath = path.resolve(process.cwd(), ".husky/pre-commit");
const bdHookPath = path.resolve(process.cwd(), "scripts/run-bd-hook.sh");
const docSyncHookPath = path.resolve(
  process.cwd(),
  "scripts/check-agents-claude-sync.sh",
);

const repos: string[] = [];

const runGit = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed: ${result.stderr || result.stdout}`,
    );
  }

  return result;
};

const copyHookFixture = (cwd: string) => {
  mkdirSync(path.join(cwd, ".husky"), { recursive: true });
  mkdirSync(path.join(cwd, "scripts"), { recursive: true });

  writeFileSync(
    path.join(cwd, ".husky/pre-commit"),
    readFileSync(preCommitHookPath, "utf8"),
    { mode: 0o755 },
  );
  writeFileSync(
    path.join(cwd, "scripts/run-bd-hook.sh"),
    readFileSync(bdHookPath, "utf8"),
    { mode: 0o755 },
  );
  writeFileSync(
    path.join(cwd, "scripts/check-agents-claude-sync.sh"),
    readFileSync(docSyncHookPath, "utf8"),
    { mode: 0o755 },
  );
};

afterAll(() => {
  repos.forEach((cwd) => rmSync(cwd, { force: true, recursive: true }));
});

describe("install-git-hooks.sh", () => {
  it("sets core.hooksPath to .husky for the current repository", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "install-git-hooks-"));
    repos.push(cwd);

    runGit(cwd, ["init"]);
    mkdirSync(path.join(cwd, ".husky"));

    const result = spawnSync("sh", [scriptPath], {
      cwd,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(
      runGit(cwd, ["config", "--get", "core.hooksPath"]).stdout.trim(),
    ).toBe(".husky");
  });

  it("blocks git commit when staged CLAUDE.md diverges from AGENTS.md", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "install-git-hooks-"));
    repos.push(cwd);

    runGit(cwd, ["init"]);
    runGit(cwd, ["config", "user.name", "Codex Test"]);
    runGit(cwd, ["config", "user.email", "codex@example.com"]);

    copyHookFixture(cwd);
    writeFileSync(path.join(cwd, "CLAUDE.md"), "# baseline\n");
    writeFileSync(path.join(cwd, "AGENTS.md"), "# baseline\n");
    writeFileSync(path.join(cwd, "package.json"), '{"name":"tmp"}\n');

    runGit(cwd, ["add", "."]);
    runGit(cwd, ["commit", "-m", "baseline"]);

    const installResult = spawnSync("sh", [scriptPath], {
      cwd,
      encoding: "utf8",
    });

    expect(installResult.status).toBe(0);

    writeFileSync(path.join(cwd, "CLAUDE.md"), "# diverged\n");
    runGit(cwd, ["add", "CLAUDE.md"]);

    const commitResult = spawnSync("git", ["commit", "-m", "should fail"], {
      cwd,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: "/usr/bin:/bin:/usr/sbin:/sbin",
      },
    });

    expect(commitResult.status).not.toBe(0);
    expect(`${commitResult.stdout}\n${commitResult.stderr}`).toContain(
      "staged AGENTS.md must be identical",
    );
  });
});
