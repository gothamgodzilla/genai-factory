import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Read Omni model YAML. Omit fileName to enumerate files. Use extension mode for authored deltas and combined mode for the composed model.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    fileName: z
      .string()
      .optional()
      .describe("Exact file path, including any folder prefix."),
    branchId: z.string().optional(),
    mode: z.enum(["extension", "combined"]).optional(),
    includeSchema: z
      .string()
      .optional()
      .describe("Load one offloaded schema by name."),
  }),
  async execute({ modelId, fileName, branchId, mode, includeSchema }) {
    const args = ["models", "yaml-get", modelId];
    if (fileName) {
      args.push("--file-name", fileName);
    }
    if (branchId) {
      args.push("--branch-id", branchId);
    }
    if (mode) {
      args.push("--mode", mode);
    }
    if (includeSchema) {
      args.push("--include-schemas", includeSchema);
    }
    return runOmni(args);
  },
});
