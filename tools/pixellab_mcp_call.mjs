import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function readAuthHeader() {
  const configPath = join(homedir(), ".codex", "config.toml");
  const text = readFileSync(configPath, "utf8");
  const match = text.match(/AUTH_HEADER\s*=\s*"([^"]+)"/);
  if (!match) throw new Error("PixelLab AUTH_HEADER not found in Codex config.");
  return match[1];
}

function makeRequest(id, method, params = undefined) {
  const request = { jsonrpc: "2.0", id, method };
  if (params !== undefined) request.params = params;
  return `${JSON.stringify(request)}\n`;
}

function parseMessages(buffer) {
  return buffer
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function callMcp({ mode, toolName, toolArgs }) {
  const authHeader = readAuthHeader();
  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "mcp-remote@latest",
      "https://api.pixellab.ai/mcp",
      "--transport",
      "http-only",
      "--header",
      "Authorization:${AUTH_HEADER}",
    ],
    {
      env: { ...process.env, AUTH_HEADER: authHeader },
      stdio: ["pipe", "pipe", "pipe"],
      shell: process.platform === "win32",
    },
  );

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  child.stdin.write(makeRequest(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "codex-pixellab-bridge", version: "0.1.0" },
  }));
  child.stdin.write(makeRequest(2, "notifications/initialized"));

  if (mode === "list") {
    child.stdin.write(makeRequest(3, "tools/list"));
  } else if (mode === "call") {
    child.stdin.write(makeRequest(3, "tools/call", {
      name: toolName,
      arguments: toolArgs,
    }));
  } else {
    throw new Error(`Unknown mode: ${mode}`);
  }

  await new Promise((resolve) => setTimeout(resolve, Number(process.env.MCP_WAIT_MS || 10000)));
  child.kill();

  const messages = parseMessages(stdout);
  const target = messages.find((message) => message.id === 3) || messages.at(-1);
  return { result: target, stderr };
}

const [mode, toolName, rawArgs] = process.argv.slice(2);
const toolArgs = rawArgs
  ? JSON.parse(rawArgs.startsWith("@") ? readFileSync(rawArgs.slice(1), "utf8") : rawArgs)
  : undefined;
const output = await callMcp({ mode, toolName, toolArgs });
console.log(JSON.stringify(output, null, 2));
