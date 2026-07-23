import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readRepositoryFile = (path: string): string =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Codex pull request review configuration", () => {
  it("runs Codex against the pull request merge ref and posts non-empty review feedback", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );

    expect(workflow).toMatch(
      /pull_request:\s*\n\s+types:\s*\[\s*opened,\s*synchronize,\s*reopened\s*\]/,
    );
    expect(workflow).toMatch(
      /codex:\s*\n[\s\S]*?permissions:\s*\n\s+contents:\s*read[\s\S]*?outputs:\s*\n\s+final_message:\s*\$\{\{\s*steps\.run_codex\.outputs\.final-message\s*\}\}/,
    );
    expect(workflow).toMatch(
      /uses:\s*actions\/checkout@v\d+[\s\S]*?ref:\s*(?:"|')?refs\/pull\/\$\{\{\s*github\.event\.pull_request\.number\s*\}\}\/merge(?:"|')?[\s\S]*?fetch-depth:\s*0[\s\S]*?persist-credentials:\s*false/,
    );
    expect(workflow).toMatch(
      /id:\s*run_codex[\s\S]*?uses:\s*openai\/codex-action@v1[\s\S]*?openai-api-key:\s*\$\{\{\s*secrets\.OPENAI_API_KEY\s*\}\}[\s\S]*?prompt-file:\s*\.github\/codex\/prompts\/review\.md/,
    );
    expect(workflow).toMatch(
      /post_feedback:\s*\n[\s\S]*?needs:\s*codex[\s\S]*?if:\s*(?:\$\{\{\s*)?needs\.codex\.outputs\.final_message\s*!=\s*''(?:\s*\}\})?[\s\S]*?permissions:\s*\n\s+issues:\s*write\s*\n\s+pull-requests:\s*write[\s\S]*?uses:\s*actions\/github-script@v\d+[\s\S]*?issue_number:\s*context\.payload\.pull_request\.number[\s\S]*?body:\s*process\.env\.CODEX_FINAL_MESSAGE[\s\S]*?CODEX_FINAL_MESSAGE:\s*\$\{\{\s*needs\.codex\.outputs\.final_message\s*\}\}/,
    );
  });

  it("gives Codex actionable, findings-first repository review guidance", () => {
    const prompt = readRepositoryFile(".github/codex/prompts/review.md");

    expect(prompt).toMatch(/findings(?:\s|-)*first/i);
    expect(prompt).toMatch(/Critical[\s\S]*Warning[\s\S]*Suggestion/);
    expect(prompt).toMatch(/file path[\s\S]*line number/i);
    expect(prompt).toMatch(/impact[\s\S]*suggested fix/i);
    expect(prompt).toMatch(/do not lead with praise|start with findings/i);
    expect(prompt).toMatch(/If no findings remain[\s\S]*residual risk/i);
    for (const command of [
      "npm test",
      "npm run lint",
      "npm run typecheck",
      "npm run build",
      "npm run test:e2e",
    ]) {
      expect(prompt).toContain(command);
    }
    expect(prompt).toMatch(
      /correctness[\s\S]*security[\s\S]*regressions[\s\S]*accessibility[\s\S]*error handling[\s\S]*test/i,
    );
  });
});
