import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "List Omni models. Prefer SHARED models; they hold the curated semantic layer.",
  inputSchema: z.object({
    modelKind: z.enum(["SHARED", "SCHEMA", "WORKBOOK"]).optional(),
    name: z.string().optional().describe("Exact model name filter."),
    includeActiveBranches: z.boolean().optional(),
  }),
  async execute({ modelKind, name, includeActiveBranches }) {
    const args = ["models", "list"];
    if (modelKind) {
      args.push("--model-kind", modelKind);
    }
    if (name) {
      args.push("--name", name);
    }
    if (includeActiveBranches) {
      args.push("--include", "activeBranches");
    }
    return runOmni(args);
  },
});
