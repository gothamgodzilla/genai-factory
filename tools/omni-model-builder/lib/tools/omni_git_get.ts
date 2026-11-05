import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Check whether an Omni model is git-connected. A config with sshUrl or baseBranch means commit/PR; 404 means merge in Omni after explicit user approval.",
  inputSchema: z.object({
    modelId: z.string().min(1),
  }),
  async execute({ modelId }) {
    return runOmni(["models", "git-get", modelId]);
  },
});
