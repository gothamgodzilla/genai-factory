---
description: Use when you need to discover Omni models, topics, views, fields, joins, or SQL dialect before changing YAML.
---

Explore top-down: SHARED models, then topics, then a topic, then views and
fields.

- `omni_models_list` with `modelKind: SHARED`. Records live under `records`,
  not the top level. On a busy instance filter by exact name.
- Composite topics have `is_composite: true` and no `base_view_name`.
- `omni_yaml_get` without `fileName` enumerates files. `fileName` is an exact
  path, not a regex.
- Missing views are often in offloaded schemas. Call `omni_get_schemas`, then
  `omni_yaml_get` with one `includeSchema` value (commas are rejected).
- Confirm dialect from `omni_connections_list` (`bigquery`, `postgres`,
  `snowflake`, `databricks`). Use `SAFE_DIVIDE` only for BigQuery.
