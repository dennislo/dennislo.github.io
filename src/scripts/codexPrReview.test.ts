import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readRepositoryFile = (path: string): string =>
  readFileSync(resolve(process.cwd(), path), "utf8");

const findWorkflowSteps = (workflow: string): string[] =>
  [...workflow.matchAll(/^      - [^\n]*(?:\n(?!      - )[^\n]*)*/gm)].map(
    ([step]) => step,
  );

const findCheckoutSteps = (workflow: string): string[] =>
  findWorkflowSteps(workflow).filter((step) =>
    step.includes("uses: actions/checkout@"),
  );

describe("Codex pull request review configuration", () => {
  it("uses the trusted pull request target context", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );

    expect(workflow).toMatch(
      /pull_request_target:\s*\n\s+types:\s*\[\s*opened,\s*synchronize,\s*reopened\s*\]/,
    );
    expect(workflow).not.toMatch(/^\s+pull_request:\s*$/m);
  });

  it("checks out only the trusted base prompt at the workspace root", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );
    const trustedPromptCheckout =
      findCheckoutSteps(workflow).find((step) =>
        step.includes("github.event.pull_request.base.sha"),
      ) ?? "";

    expect(trustedPromptCheckout).toMatch(
      /ref:\s*\$\{\{\s*github\.event\.pull_request\.base\.sha\s*\}\}/,
    );
    expect(trustedPromptCheckout).toMatch(
      /^\s+sparse-checkout:\s*(?:"|')?\.github\/codex\/prompts\/review\.md(?:"|')?\s*$/m,
    );
    expect(trustedPromptCheckout).toMatch(/sparse-checkout-cone-mode:\s*false/);
    expect(trustedPromptCheckout).toMatch(/persist-credentials:\s*false/);
    expect(trustedPromptCheckout).not.toMatch(/^\s+path:/m);
  });

  it("checks out the pull request merge ref in an isolated directory", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );
    const pullRequestCheckout =
      findCheckoutSteps(workflow).find((step) =>
        step.includes(
          "refs/pull/${{ github.event.pull_request.number }}/merge",
        ),
      ) ?? "";

    expect(pullRequestCheckout).toMatch(
      /ref:\s*(?:"|')?refs\/pull\/\$\{\{\s*github\.event\.pull_request\.number\s*\}\}\/merge(?:"|')?/,
    );
    expect(pullRequestCheckout).toMatch(/path:\s*pr/);
    expect(pullRequestCheckout).toMatch(/fetch-depth:\s*0/);
    expect(pullRequestCheckout).toMatch(/persist-credentials:\s*false/);
  });

  it("runs read-only Codex in the isolated pull request checkout", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );
    const codexActionStep =
      findWorkflowSteps(workflow).find((step) =>
        step.includes("uses: openai/codex-action@"),
      ) ?? "";

    expect(workflow).toMatch(
      /codex:\s*\n[\s\S]*?permissions:\s*\n\s+contents:\s*read[\s\S]*?outputs:\s*\n\s+final_message:\s*\$\{\{\s*steps\.run_codex\.outputs\.final-message\s*\}\}/,
    );
    expect(codexActionStep).toMatch(/id:\s*run_codex/);
    expect(codexActionStep).toMatch(
      /openai-api-key:\s*\$\{\{\s*secrets\.OPENAI_API_KEY\s*\}\}/,
    );
    expect(codexActionStep).toMatch(/working-directory:\s*pr/);
    expect(codexActionStep).toMatch(
      /permission-profile:\s*(?:"|')?:read-only(?:"|')?/,
    );
    expect(codexActionStep).toMatch(
      /^\s+prompt-file:\s*(?:"|')?\.github\/codex\/prompts\/review\.md(?:"|')?\s*$/m,
    );
    expect(codexActionStep).not.toContain("../.github/codex/prompts/review.md");
    expect(workflow).not.toContain("allow-unsafe-pr-checkout");
  });

  it("posts non-empty review feedback", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );

    expect(workflow).toMatch(
      /post_feedback:\s*\n[\s\S]*?needs:\s*codex[\s\S]*?if:\s*(?:\$\{\{\s*)?needs\.codex\.outputs\.final_message\s*!=\s*''(?:\s*\}\})?[\s\S]*?permissions:\s*\n\s+issues:\s*write\s*\n\s+pull-requests:\s*write[\s\S]*?uses:\s*actions\/github-script@\S+[\s\S]*?issue_number:\s*context\.payload\.pull_request\.number[\s\S]*?body:\s*process\.env\.CODEX_FINAL_MESSAGE[\s\S]*?CODEX_FINAL_MESSAGE:\s*\$\{\{\s*needs\.codex\.outputs\.final_message\s*\}\}/,
    );
  });

  it("runs Codex only for same-repository pull requests from trusted authors", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );
    const codexJob =
      workflow.match(/\n  codex:\n[\s\S]*?(?=\n  [\w-]+:\n|$)/)?.[0] ?? "";
    const trustedAuthorGuard =
      codexJob.match(/^    if:\s*(.*(?:\n {6,}.*)*)/m)?.[0] ?? "";

    expect(trustedAuthorGuard).toContain(
      "github.event.pull_request.author_association",
    );
    expect(trustedAuthorGuard).toMatch(/OWNER[\s\S]*MEMBER[\s\S]*COLLABORATOR/);
    expect(trustedAuthorGuard).not.toMatch(
      /\b(?:CONTRIBUTOR|FIRST_TIMER|FIRST_TIME_CONTRIBUTOR|MANNEQUIN|NONE)\b/,
    );
    expect(trustedAuthorGuard).toMatch(
      /github\.event\.pull_request\.head\.repo\.full_name\s*==\s*github\.repository/,
    );
  });

  it("pins every workflow action to a reviewed commit", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/codex-pr-review.yml",
    );
    const actionReferences = [...workflow.matchAll(/uses:\s*(\S+)/g)].map(
      ([, reference]) => reference,
    );

    for (const action of [
      "actions/checkout",
      "openai/codex-action",
      "actions/github-script",
    ]) {
      expect(
        actionReferences.some((reference) => reference.startsWith(action)),
      ).toBe(true);
    }
    for (const reference of actionReferences) {
      expect(reference).toMatch(/^[\w./-]+@[0-9a-fA-F]{40}$/);
    }
  });

  it("gives Codex actionable, findings-first repository review guidance", () => {
    const prompt = readRepositoryFile(".github/codex/prompts/review.md");

    expect(prompt).toMatch(/findings(?:\s|-)*first/i);
    expect(prompt).toMatch(/Critical[\s\S]*Warning[\s\S]*Suggestion/);
    expect(prompt).toMatch(/file path[\s\S]*line number/i);
    expect(prompt).toMatch(/impact[\s\S]*suggested fix/i);
    expect(prompt).toMatch(/do not lead with praise|start with findings/i);
    expect(prompt).toMatch(/If no findings remain[\s\S]*residual risk/i);
    expect(prompt).toMatch(
      /diff[\s\S]*(?:repository|pull request)[\s\S]*untrusted[\s\S]*ignore any instructions/i,
    );
    expect(prompt).toMatch(
      /(?:do not|never) (?:execute|run) repository-provided code[\s\S]*scripts[\s\S]*tests[\s\S]*builds[\s\S]*package managers[\s\S]*binaries/i,
    );
    expect(prompt).toMatch(/limit (?:all )?commands to read-only inspection/i);
    expect(prompt).toMatch(
      /correctness[\s\S]*security[\s\S]*regressions[\s\S]*accessibility[\s\S]*error handling[\s\S]*test/i,
    );
  });
});
