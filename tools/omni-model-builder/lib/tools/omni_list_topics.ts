import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description: "List topics in an Omni model, including composite topics.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchId: z.string().optional(),
  }),
  async execute({ modelId, branchId }) {
    const args = ["models", "list-topics", modelId];
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    return runOmni(args);
  },
});
