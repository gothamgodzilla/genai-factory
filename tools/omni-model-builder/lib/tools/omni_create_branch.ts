import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Create an Omni model branch. Always work on a branch; never write YAML to production.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    name: z
      .string()
      .min(1)
      .describe("Descriptive branch name such as add-customer-ltv-metrics."),
  }),
  async execute({ modelId, name }) {
    return runOmni(["models", "create-branch", modelId, "--name", name]);
  },
});
