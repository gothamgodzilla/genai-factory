import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Omni Analytics model validator. Runs model validation and semantic test queries, then reports blocking issues and row-count checks.",
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
});
