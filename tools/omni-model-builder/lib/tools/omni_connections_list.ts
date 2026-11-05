import { defineTool } from "eve/tools";
import { z } from "zod";

import { runOmni } from "../omni.ts";

export default defineTool({
  description:
    "List Omni connections so you can read the SQL dialect before writing expressions.",
  inputSchema: z.object({}),
  async execute() {
    return runOmni(["connections", "list"]);
  },
});
