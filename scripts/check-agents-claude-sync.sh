#!/bin/sh

set -eu

canonical_path="CLAUDE.md"
mirror_path="AGENTS.md"

print_remediation() {
  cat >&2 <<'EOF'
Restore both canonical paths if either file was deleted or renamed, then resync with:
  cp CLAUDE.md AGENTS.md
  git add CLAUDE.md AGENTS.md
EOF
}

fail_missing_path() {
  missing_path=$1

  printf '%s\n' "ERROR: ${missing_path} must remain tracked in the Git index." >&2
  print_remediation
  exit 1
}

staged_doc_changes=$(git diff --cached --name-only --diff-filter=ACDMR -- "$mirror_path" "$canonical_path")

if [ -z "$staged_doc_changes" ]; then
  exit 0
fi

if ! canonical_blob=$(git rev-parse --verify --quiet ":$canonical_path"); then
  fail_missing_path "$canonical_path"
fi

if ! mirror_blob=$(git rev-parse --verify --quiet ":$mirror_path"); then
  fail_missing_path "$mirror_path"
fi

if [ "$canonical_blob" = "$mirror_blob" ]; then
  exit 0
fi

printf '%s\n' "ERROR: staged AGENTS.md must be identical to staged CLAUDE.md." >&2
print_remediation
exit 1
