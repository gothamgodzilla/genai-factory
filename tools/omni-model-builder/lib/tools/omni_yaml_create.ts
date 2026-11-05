import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Write a complete Omni YAML file onto a branch. yaml-create replaces the file; yaml-get it first and write the full contents back. fileName must be the exact path.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    fileName: z
      .string()
      .min(1)
      .describe("Exact path such as MARTS/fct_orders.view"),
    yaml: z.string().describe("Complete file YAML, not a field-level patch."),
    branchId: z.string().min(1).describe("Branch UUID from create-branch."),
    commitMessage: z.string().min(1),
    mode: z.enum(["extension"]).default("extension"),
  }),
  approval: {
    request: always(),
    prompt: ({ input }) =>
      `Write ${input.fileName} on branch ${input.branchId}? This replaces the whole authored file.`,
  },
  async execute(input) {
    return runOmni([
      "models",
      "yaml-create",
      input.modelId,
      "--body",
      JSON.stringify({
        fileName: input.fileName,
        yaml: input.yaml,
        mode: input.mode,
        branchId: input.branchId,
        commitMessage: input.commitMessage,
      }),
    ]);
  },
});
