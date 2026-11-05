import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type OmniExecResult = {
  stdout: string;
  stderr: string;
};

export type OmniExecFile = (
  file: string,
  args: readonly string[],
  options: {
    timeout?: number;
    maxBuffer?: number;
    env?: NodeJS.ProcessEnv;
  },
) => Promise<OmniExecResult>;

export type OmniCommandResult = {
  ok: boolean;
  command: string;
  stdout: string;
  stderr: string;
  data: unknown;
  error?: string;
};

const SECRET_KEY = /token|apikey|api_key|secret|password|authorization/i;
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_BUFFER = 20 * 1024 * 1024;

export function omniBinary(): string {
  return process.env.OMNI_BIN?.trim() || "omni";
}

export function assertMergeAllowed(userExplicitlyAskedToMerge: boolean): void {
  if (!userExplicitlyAskedToMerge) {
    throw new Error(
      "HARD STOP: refuse to merge or promote a branch. The user must explicitly ask to merge, ship, publish, promote, or make it live in this conversation.",
    );
  }
}

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSecrets);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, nested]) => {
        if (SECRET_KEY.test(key) && typeof nested === "string") {
          return [key, nested ? "[redacted]" : nested];
        }
        return [key, redactSecrets(nested)];
      },
    );
    return Object.fromEntries(entries);
  }
  return value;
}

export function parseOmniOutput(stdout: string, stderr: string): unknown {
  const chunks = [stdout, stderr]
    .flatMap((text) => text.split(/\r?\n/))
    .map((line) => line.trim())
    .filter(Boolean);
  const parsed: unknown[] = [];
  for (const line of chunks) {
    try {
      parsed.push(JSON.parse(line));
    } catch {
      // Non-JSON diagnostic lines are ignored while scanning.
    }
  }
  if (parsed.length === 1) {
    return parsed[0];
  }
  if (parsed.length > 1) {
    return parsed;
  }
  const combined = stdout.trim();
  if (!combined) {
    return null;
  }
  try {
    return JSON.parse(combined);
  } catch {
    return { text: combined };
  }
}

function isMissingBinary(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}

export async function runOmni(
  args: readonly string[],
  options: {
    execFile?: OmniExecFile;
    timeoutMs?: number;
    redact?: boolean;
  } = {},
): Promise<OmniCommandResult> {
  const bin = omniBinary();
  const argv = args.includes("-o") || args.includes("--output")
    ? [...args]
    : [...args, "-o", "json"];
  const command = [bin, ...argv].join(" ");
  const exec = options.execFile ?? defaultExecFile;

  try {
    const { stdout, stderr } = await exec(bin, argv, {
      timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxBuffer: DEFAULT_MAX_BUFFER,
      env: process.env,
    });
    const data = parseOmniOutput(stdout, stderr);
    return {
      ok: true,
      command,
      stdout,
      stderr,
      data: options.redact ? redactSecrets(data) : data,
    };
  } catch (error) {
    if (isMissingBinary(error)) {
      return {
        ok: false,
        command,
        stdout: "",
        stderr: "",
        data: null,
        error:
          "Omni CLI is not installed or not on PATH. Install it from https://github.com/exploreomni/cli#readme and authenticate with `omni config login` or OMNI_API_TOKEN.",
      };
    }
    const err = error as {
      stdout?: string;
      stderr?: string;
      message?: string;
      code?: number | string;
    };
    const stdout = err.stdout ?? "";
    const stderr = err.stderr ?? "";
    const data = parseOmniOutput(stdout, stderr);
    return {
      ok: false,
      command,
      stdout,
      stderr,
      data: options.redact ? redactSecrets(data) : data,
      error: stderr.trim() || err.message || "omni command failed",
    };
  }
}

const defaultExecFile: OmniExecFile = async (file, args, options) => {
  const result = await execFileAsync(file, [...args], options);
  return { stdout: result.stdout, stderr: result.stderr };
};
