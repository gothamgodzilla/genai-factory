import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description: "List views available on an Omni model or branch.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchId: z.string().optional(),
  }),
  async execute({ modelId, branchId }) {
    const args = ["models", "get-views", modelId];
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    return runOmni(args);
  },
});
