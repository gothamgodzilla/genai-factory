import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Inspect one Omni topic, including joins, views, and join_via_map.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    topicName: z.string().min(1),
    branchId: z.string().optional(),
  }),
  async execute({ modelId, topicName, branchId }) {
    const args = ["models", "get-topic", modelId, topicName];
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    return runOmni(args);
  },
});
