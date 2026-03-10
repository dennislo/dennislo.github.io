/** @jest-environment node */

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.resolve(
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
};

const runCheck = (cwd: string) =>
  spawnSync("sh", [scriptPath], {
    cwd,
    encoding: "utf8",
  });

const initRepo = () => {
  const cwd = mkdtempSync(path.join(tmpdir(), "agents-claude-sync-"));
  repos.push(cwd);

  runGit(cwd, ["init"]);
  runGit(cwd, ["config", "user.name", "Codex Test"]);
  runGit(cwd, ["config", "user.email", "codex@example.com"]);

  writeFileSync(path.join(cwd, "CLAUDE.md"), "# Shared baseline\n");
  writeFileSync(path.join(cwd, "AGENTS.md"), "# Shared baseline\n");
  writeFileSync(path.join(cwd, "README.md"), "baseline\n");

  runGit(cwd, ["add", "CLAUDE.md", "AGENTS.md", "README.md"]);
  runGit(cwd, ["commit", "-m", "baseline"]);

  return cwd;
};

afterAll(() => {
  repos.forEach((cwd) => rmSync(cwd, { force: true, recursive: true }));
});

describe("check-agents-claude-sync.sh", () => {
  it("passes when neither mirrored doc is staged", () => {
    const cwd = initRepo();

    writeFileSync(path.join(cwd, "README.md"), "changed\n");
    runGit(cwd, ["add", "README.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });

  it("fails when only AGENTS.md is staged and diverges from CLAUDE.md", () => {
    const cwd = initRepo();

    writeFileSync(path.join(cwd, "AGENTS.md"), "# Diverged mirror\n");
    runGit(cwd, ["add", "AGENTS.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("staged AGENTS.md must be identical");
    expect(result.stderr).toContain("cp CLAUDE.md AGENTS.md");
  });

  it("fails when only CLAUDE.md is staged and diverges from AGENTS.md", () => {
    const cwd = initRepo();

    writeFileSync(path.join(cwd, "CLAUDE.md"), "# Updated baseline\n");
    runGit(cwd, ["add", "CLAUDE.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("staged AGENTS.md must be identical");
  });

  it("passes when both docs are staged with identical content", () => {
    const cwd = initRepo();

    writeFileSync(path.join(cwd, "CLAUDE.md"), "# Updated baseline\n");
    writeFileSync(path.join(cwd, "AGENTS.md"), "# Updated baseline\n");
    runGit(cwd, ["add", "CLAUDE.md", "AGENTS.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(0);
  });

  it("fails when both docs are staged with different content", () => {
    const cwd = initRepo();

    writeFileSync(path.join(cwd, "CLAUDE.md"), "# Updated baseline\n");
    writeFileSync(path.join(cwd, "AGENTS.md"), "# Diverged mirror\n");
    runGit(cwd, ["add", "CLAUDE.md", "AGENTS.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("staged AGENTS.md must be identical");
  });

  it("fails when AGENTS.md is removed from the index", () => {
    const cwd = initRepo();

    runGit(cwd, ["rm", "AGENTS.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("AGENTS.md must remain tracked");
  });

  it("fails when AGENTS.md is renamed away from its canonical path", () => {
    const cwd = initRepo();

    runGit(cwd, ["mv", "AGENTS.md", "AGENTS-renamed.md"]);

    const result = runCheck(cwd);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("AGENTS.md must remain tracked");
  });
});
