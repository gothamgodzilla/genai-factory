import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Omni Analytics semantic model builder. Creates branches, writes view/topic/relationship YAML, validates, and tests. Never merges unless the user explicitly asks.",
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
});
