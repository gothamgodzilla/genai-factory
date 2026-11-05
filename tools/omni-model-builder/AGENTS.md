# Omni Model Builder Agents

This eve workspace exposes three Omni Analytics specialists: `explorer`,
`builder`, and `validator`.

For eve APIs, read `node_modules/eve/docs/README.md` before authoring tools,
skills, channels, or evals.

## Omni rules

- Explore the SHARED model before writing YAML.
- Work on a branch. `branchId` is a UUID from `create-branch`, never a name.
- `yaml-create` replaces a whole file. Read, edit, write the complete file
  at its exact path.
- Do not merge or promote unless the user explicitly asked in this
  conversation. Approval on `omni_merge_branch` is not a substitute for that
  ask.
- Never hand-edit git-connected Omni model YAML in git.

## Commands

```sh
npx eve dev --agent builder
npx eve info --agent builder
npm test
npm run typecheck
```
