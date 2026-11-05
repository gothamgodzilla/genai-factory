import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Inspect the authenticated Omni identity and model permissions.",
  inputSchema: z.object({
    modelId: z.string().optional().describe("Optional model UUID to scope rolesByModel."),
  }),
  async execute({ modelId }) {
    const args = ["whoami", "whoami"];
    if (modelId) {
      args.push("--model-id", modelId);
    }
    return runOmni(args, { redact: true });
  },
});
