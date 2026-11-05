import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "List schemas the Omni connection knows about, including offloaded schemas.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchId: z.string().optional(),
  }),
  async execute({ modelId, branchId }) {
    const args = ["models", "get-schemas", modelId];
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    return runOmni(args);
  },
});
