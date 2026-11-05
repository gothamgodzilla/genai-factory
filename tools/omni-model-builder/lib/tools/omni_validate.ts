import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Validate an Omni model or branch. New issues with is_warning:false that reference changed files are blocking.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchId: z.string().optional(),
  }),
  async execute({ modelId, branchId }) {
    const args = ["models", "validate", modelId];
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    return runOmni(args);
  },
});
