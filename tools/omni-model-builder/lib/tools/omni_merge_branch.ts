import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { assertMergeAllowed, runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Merge an Omni branch into the shared model. HARD STOP: call only when the user explicitly asked to merge, ship, publish, or promote in this conversation.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchName: z.string().min(1),
    userExplicitlyAskedToMerge: z
      .boolean()
      .describe(
        "True only if the user said merge, ship, publish, promote, or make it live in this conversation.",
      ),
  }),
  approval: {
    request: always(),
    prompt: ({ input }) =>
      `Merge Omni branch ${input.branchName} into the shared model? This cannot be easily undone.`,
  },
  async execute(input) {
    assertMergeAllowed(input.userExplicitlyAskedToMerge);
    return runOmni([
      "models",
      "merge-branch",
      input.modelId,
      input.branchName,
    ]);
  },
});
