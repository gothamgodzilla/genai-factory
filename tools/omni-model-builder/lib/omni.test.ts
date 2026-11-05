import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertMergeAllowed,
  parseOmniOutput,
  redactSecrets,
  runOmni,
} from "./omni.ts";

describe("assertMergeAllowed", () => {
  it("throws unless the user explicitly asked to merge", () => {
    assert.throws(
      () => assertMergeAllowed(false),
      /HARD STOP: refuse to merge/,
    );
  });

  it("allows an explicit merge request", () => {
    assert.doesNotThrow(() => assertMergeAllowed(true));
  });
});

describe("redactSecrets", () => {
  it("redacts credential fields and leaves the rest", () => {
    assert.deepEqual(
      redactSecrets({
        apiKey: "secret-value",
        apiEndpoint: "https://example.omniapp.co",
        nested: { token: "abc", name: "shared" },
      }),
      {
        apiKey: "[redacted]",
        apiEndpoint: "https://example.omniapp.co",
        nested: { token: "[redacted]", name: "shared" },
      },
    );
  });
});

describe("parseOmniOutput", () => {
  it("parses a single JSON document", () => {
    assert.deepEqual(parseOmniOutput('{"ok":true}\n', ""), { ok: true });
  });

  it("parses newline-delimited JSON as an array", () => {
    assert.deepEqual(parseOmniOutput('{"a":1}\n{"b":2}\n', ""), [
      { a: 1 },
      { b: 2 },
    ]);
  });
});

describe("runOmni", () => {
  it("adds -o json and returns parsed data", async () => {
    const result = await runOmni(["whoami", "whoami"], {
      execFile: async (_file, args) => {
        assert.deepEqual([...args], ["whoami", "whoami", "-o", "json"]);
        return { stdout: '{"user":{"email":"a@b.c"}}\n', stderr: "" };
      },
    });
    assert.equal(result.ok, true);
    assert.deepEqual(result.data, { user: { email: "a@b.c" } });
  });

  it("explains a missing Omni binary", async () => {
    const result = await runOmni(["whoami", "whoami"], {
      execFile: async () => {
        const error = new Error("not found") as Error & { code: string };
        error.code = "ENOENT";
        throw error;
      },
    });
    assert.equal(result.ok, false);
    assert.match(result.error ?? "", /Omni CLI is not installed/);
  });
});
