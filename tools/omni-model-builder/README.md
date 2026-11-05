# Omni Model Builder Agents

An [eve](https://eve.dev) workspace that turns the Omni Analytics model-builder
workflow into three durable agents:

| Agent | Command | Role |
| :--- | :--- | :--- |
| `explorer` | `npx eve dev --agent explorer` | Read-only discovery of shared models, topics, views, and joins |
| `builder` | `npx eve dev --agent builder` | Branch, write YAML, validate, and test. Never merges unless you ask |
| `validator` | `npx eve dev --agent validator` | Model validation and semantic query checks |

The builder follows Omni's layered model (schema / shared / branch), writes
only through the Omni CLI on a branch, and treats merge or promote as a
separate, user-initiated step.

## Prerequisites

- Node.js 24 (`engines.node` is `24.x`; see `.nvmrc`)
- [Omni CLI](https://github.com/exploreomni/cli#readme)
- An Omni profile with Modeler or Connection Admin access, **or**
  `OMNI_API_TOKEN` plus `OMNI_BASE_URL`
- A Vercel AI Gateway credential, ChatGPT login, or provider API key for eve

```bash
command -v omni >/dev/null || echo "Install the Omni CLI first."
omni config show
omni whoami whoami
```

If `whoami` returns 401, authenticate yourself with
`omni config login <profile>`. This environment cannot complete a browser
login.

Copy `.env.example` to `.env.local` and fill in the values you need.

## Run

From this directory:

```bash
npm install
npx eve dev --agent builder --non-interactive
```

Drop `--non-interactive` to open the eve terminal UI. Use `--agent explorer`
or `--agent validator` to talk to a specialist directly.

Write tools (`omni_yaml_create`, `omni_commit`, `omni_merge_branch`) require
human approval. Merge also requires an explicit ask in the conversation
(`merge`, `ship`, `publish`, `promote`, or `make it live`).

## Tests

```bash
npm test          # Omni CLI wrapper unit tests (no Omni account needed)
npm run typecheck
npx eve eval --agent builder   # needs model credentials and Omni stubs
```

## Layout

```text
lib/                          shared Omni CLI client and tool implementations
agents/explorer/agent/        read-only discovery agent
agents/builder/agent/         YAML authoring agent
agents/validator/agent/       validate + query agent
```

Author Omni model content through these agents (or the Omni APIs) on a
branch. Do not hand-edit git-connected `*.view` / `*.topic` files in a
repository Omni regenerates.

## Learn more

- [eve documentation](https://eve.dev/docs)
- [Omni model YAML API](https://docs.omni.co/api/models.md)
- [Omni CLI](https://github.com/exploreomni/cli#readme)
