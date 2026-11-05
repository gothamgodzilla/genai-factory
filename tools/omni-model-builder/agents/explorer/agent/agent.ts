import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Read-only Omni Analytics model explorer. Use to discover shared models, topics, views, fields, joins, and SQL dialect before any YAML change.",
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
});
