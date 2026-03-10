#!/bin/sh

set -eu

hook_name=${1:?hook name is required}
shift

if command -v bd >/dev/null 2>&1; then
  export BD_GIT_HOOK=1
  bd hooks run "$hook_name" "$@"
fi
