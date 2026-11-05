import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Run an Omni semantic query to test fields. Confirm cache_metadata.num_rows > 0 and summary.missing_fields is empty.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    table: z.string().min(1).describe("Base view name."),
    fields: z.array(z.string().min(1)).min(1),
    topicName: z
      .string()
      .optional()
      .describe("join_paths_from_topic_name for topic-scoped queries."),
    branchId: z.string().optional(),
    limit: z.number().int().positive().max(100).default(10),
  }),
  async execute(input) {
    const query: Record<string, unknown> = {
      modelId: input.modelId,
      table: input.table,
      fields: input.fields,
      limit: input.limit,
    };
    if (input.topicName) {
      query.join_paths_from_topic_name = input.topicName;
    }
    const body: Record<string, unknown> = { query };
    if (input.branchId) {
      body.branchId = input.branchId;
    }
    return runOmni(["query", "run", "--body", JSON.stringify(body)]);
  },
});
