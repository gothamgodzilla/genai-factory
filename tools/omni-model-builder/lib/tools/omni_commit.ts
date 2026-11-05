import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "Push an Omni branch to git and open or update a pull request. Use only on git-connected models after validation and testing pass.",
  inputSchema: z.object({
    modelId: z.string().min(1),
    branchId: z.string().min(1),
    commitMessage: z.string().min(1),
  }),
  approval: {
    request: always(),
    prompt: ({ input }) =>
      `Commit Omni branch ${input.branchId} and open or update its git pull request?`,
  },
  async execute(input) {
    return runOmni([
      "models",
      "commit",
      input.modelId,
      "--body",
      JSON.stringify({
        branch_id: input.branchId,
        commit_message: input.commitMessage,
      }),
    ]);
  },
});
