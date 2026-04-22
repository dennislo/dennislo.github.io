- [x] Remove React.FC
- [x] Scheduled tasks: posts summary latest of AI blogger daily
- [x] Add Orchestrator agent
  - agents using worktree + branching strategy
  - board setup, creating subtasks
  - agent delegation with how to speak to it
- [x] Learn how to get github pipeline checks auto checked in a loop, suggest fixes, apply fixes
- [x] Update claude files repo with change discipline section
- [x] Familiarise yourself with Codex Automations
- [ ] Familiarise yourself with MCP integration
- [ ] Look into Claude hooks
- [ ] Look into Claude Design
- [ ] Look into Stitch by Google
- [ ] Claude Code: Learn how to use the AskUserQuestion tool to ask for clarification when needed
- [ ] AI Native Github Workflows
  - claude-code-review.yml — fires on ready_for_review, runs anthropics/claude-code-action with a long, very
    opinionated prompt enforcing our house rules: no fake-optional props, no ?? fallback band-aids, no duplicate API
    fetches when a Context already has the data, no local interface when @shared/ has the type, protect the Paddle
    pricing integration from accidental deletion. It leaves inline review comments. This is a senior reviewer’s taste
    encoded and applied to 100% of PRs.
- [ ] AI Skill
  - tech-debt-bot — runs nightly, unattended: picks the highest-priority Notion ticket, uses claude -p to name a
    branch, spins up a git worktree + Supabase preview branch, fixes the thing, opens a draft PR. The LLM is the
    only thing that can read the ticket and decide whether it’s actually doable tonight.
