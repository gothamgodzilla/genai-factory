---
description: Use when validating Omni YAML or testing new fields with a semantic query.
---

Validate, then query, then read back.

1. `omni_validate` with `--branch-id` for unpublished work. Blocking: a new
   issue with `is_warning: false` that references a changed file.
2. `omni_query_run` with the topic name so joins resolve.
3. Pass criteria:
   - no query error
   - `cache_metadata.num_rows` > 0 (there is no `summary.row_count`)
   - `summary.missing_fields` is `[]`
   - `summary.invalid_calculations` is empty (`{}` is empty)
4. `omni_yaml_get` the file and confirm a single path.

Join-path check: include fields from both views. Topic join check: use
`omni_get_topic` and confirm the joined view is actually exposed. Validate
cannot catch a missing `joins` entry.
