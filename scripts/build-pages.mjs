import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const commandSuffix = process.platform === "win32" ? ".cmd" : "";
const nodeBinDir = dirname(process.execPath);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = join(rootDir, "src", "app", "api");
const disabledApiDir = join(rootDir, ".static-build-api-disabled");

function run(command, args, env = {}) {
  const localCommand = join(nodeBinDir, `${command}${commandSuffix}`);
  const executable = existsSync(localCommand) ? localCommand : `${command}${commandSuffix}`;
  const result = spawnSync(executable, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ...env,
    },
  });

  if (result.error) {
    console.error(result.error.message);
  }

  if (result.status !== 0) {
    const error = new Error(`${command} ${args.join(" ")} failed`);
    error.exitCode = result.status ?? 1;
    throw error;
  }
}

let exitCode = 0;

try {
  run("npx", ["prisma", "generate"]);
} catch (error) {
  console.error(error.message);
  process.exit(error.exitCode ?? 1);
}

if (existsSync(disabledApiDir)) {
  rmSync(disabledApiDir, { recursive: true, force: true });
}

try {
  rmSync(join(rootDir, ".next"), { recursive: true, force: true });

  if (existsSync(apiDir)) {
    renameSync(apiDir, disabledApiDir);
  }

  run("npx", ["next", "build"], {
    NEXT_TELEMETRY_DISABLED: "1",
    STATIC_EXPORT: "1",
  });
} catch (error) {
  console.error(error.message);
  exitCode = error.exitCode ?? 1;
} finally {
  if (existsSync(disabledApiDir)) {
    renameSync(disabledApiDir, apiDir);
  }
}

process.exit(exitCode);
