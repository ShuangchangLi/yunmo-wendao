import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const API_ROOT = "https://api.retrodiffusion.ai/v1";

function getToken() {
  const token = process.env.RD_API_KEY;
  if (!token) {
    throw new Error("Missing RD_API_KEY. Set it in your shell before running this tool.");
  }
  return token;
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];
    if (!part.startsWith("--")) {
      args._.push(part);
      continue;
    }
    const key = part.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function coerceValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}

async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-RD-Token": getToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const message = data?.detail?.message || data?.message || response.statusText;
    throw new Error(`Retro Diffusion ${response.status}: ${message}`);
  }
  return data;
}

async function saveBase64(base64, outputPath) {
  const out = resolve(outputPath);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(base64, "base64"));
  return out;
}

function inferExtension(payload) {
  if (payload.return_spritesheet) return "png";
  if (String(payload.prompt_style || "").startsWith("rd_animation__")) return "gif";
  if (String(payload.prompt_style || "").startsWith("rd_advanced_animation__")) return "gif";
  return "png";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || command === "help") {
    console.log(`Usage:
  node tools/retro_diffusion_client.mjs credits
  node tools/retro_diffusion_client.mjs cost --prompt "..." --style rd_pro__default --width 256 --height 256
  node tools/retro_diffusion_client.mjs generate --prompt "..." --style rd_pro__spritesheet --width 256 --height 256 --out tmp/rd/out.png
  node tools/retro_diffusion_client.mjs animate --input src/assets/portraits/cleaner-headshot.png --prompt "slow breathing idle" --style rd_advanced_animation__idle --width 128 --height 128 --frames 8 --spritesheet --out tmp/rd/cleaner-idle.png
`);
    return;
  }

  if (command === "credits") {
    const data = await request("/inferences/credits");
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const payload = {
    width: Number(args.width || 256),
    height: Number(args.height || 256),
    prompt: args.prompt || "",
    prompt_style: args.style || args.prompt_style || "rd_pro__default",
    num_images: Number(args.num_images || 1),
  };

  if (args.seed) payload.seed = Number(args.seed);
  if (args.remove_bg) payload.remove_bg = true;
  if (args.spritesheet || args.return_spritesheet) payload.return_spritesheet = true;
  if (args.upscale !== undefined) payload.upscale_output_factor = coerceValue(args.upscale);
  if (args.frames) payload.frames_duration = Number(args.frames);
  if (args.include_downloadable_data) payload.include_downloadable_data = true;
  if (args.input) {
    const bytes = await readFile(resolve(args.input));
    payload.input_image = bytes.toString("base64");
  }

  if (command === "cost") {
    payload.check_cost = true;
    const data = await request("/inferences", { method: "POST", body: payload });
    console.log(JSON.stringify({
      balance_cost: data.balance_cost,
      remaining_balance: data.remaining_balance,
      model: data.model,
    }, null, 2));
    return;
  }

  if (command === "generate" || command === "animate") {
    const data = await request("/inferences", { method: "POST", body: payload });
    const images = data.base64_images || [];
    if (!images.length) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    const ext = inferExtension(payload);
    const baseOut = args.out || `tmp/rd/output.${ext}`;
    const saved = [];
    for (let i = 0; i < images.length; i += 1) {
      const out = images.length === 1
        ? baseOut
        : baseOut.replace(new RegExp(`\\.${ext}$`), `-${i}.${ext}`);
      saved.push(await saveBase64(images[i], out));
    }
    console.log(JSON.stringify({
      saved,
      balance_cost: data.balance_cost,
      remaining_balance: data.remaining_balance,
      model: data.model,
    }, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
