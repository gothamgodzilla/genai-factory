---
description: Use when adding or editing Omni views, topics, measures, dimensions, relationships, or query views on a branch.
---

Author through Omni APIs on a branch. Never hand-edit git-connected model YAML.

## Branch

`omni_create_branch` returns `model.id` as the branch UUID. Pass that UUID as
`branchId`. A branch name in `branchId` returns 400.

## Whole-file writes

`omni_yaml_create` replaces authored content. `omni_yaml_get` first, edit,
write the complete file back. Reuse the exact path (`MARTS/fct_orders.view`).
A wrong path silently creates a duplicate (`success: true`).

## View rules

- Joinable views need a real row-unique `primary_key: true`.
- Prefer measure `filters:` over CASE/WHERE in `sql`.
- No `${TABLE}`. Use `${field}` or `${view.field}`.
- Schema layer owns types; extension YAML owns labels, hidden, measures.
- Query views need `primary_key: true` or `custom_compound_primary_key_sql`.

## Topics

- `joins` exposes views; `relationships` define ON conditions. Both are
  required for a one-off join. Omitting `joins` still validates.
- Global relationship already present with the same `on_sql`: use `joins`
  only.
- Cross-view `${other.field}` belongs on the topic `views:` block when the
  join is topic-specific.

## Ship

Git-connected (`omni_git_get` has `sshUrl` / `baseBranch`): `omni_commit`
opens a PR. Not git-connected: `omni_merge_branch` only after an explicit
user merge request in this conversation.
