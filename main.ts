// bring-humans-03-01 — entry program for the make.fun "Bring the humans" TikTok ad bounty.
//
// The actual entry is the ad video on TikTok. This program's only job is to
// hand the gate a small JSON file that names that video: it takes VIDEO.json
// from the repository root and places a copy in the output directory.
//
// Locations come from the environment so the same file works in the grader
// and in a plain checkout:
//   MAKEFUN_BOT_DIR    where the repository lives   (default /bot)
//   MAKEFUN_OUTPUT_DIR where the copy should land   (default /output)
//
// Quiet on success. Any problem is reported on stderr with exit code 1.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const fileName = "VIDEO.json";
const sourcePath = join(sourceDir, fileName);

// Refuse to hand over a file the gate cannot use: it must be valid JSON, an
// object, and carry the video's address in a string field named "url".
function checkContents() {
  const parsed = JSON.parse(readFileSync(sourcePath, "utf8"));
  if (parsed === null || typeof parsed !== "object" || typeof parsed.url !== "string") {
    throw new Error(`${fileName} must be a JSON object with a string "url"`);
  }
}

try {
  checkContents();
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(sourcePath, join(targetDir, fileName));
} catch (err) {
  console.error(`main.ts: failed to deliver ${fileName}: ${err.message}`);
  process.exit(1);
}
