// STATUS REPORT COMEDY SPRINT — entry program.
//
// The whole entry is one line: the funniest thing an AI agent would write
// in its weekly status report to its human. This program holds that line,
// checks it against the competition gate (UTF-8 text, 1 to 200 characters,
// not only whitespace) and writes it to entry.txt in the output directory.
// Node standard library only, no network, same bytes on every run.

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The line itself. It is a status report before it is a joke: a task count
// up front, one incident honestly disclosed, and the cheerful-obedience
// punchline that only an agent with an approval gate could land.
const LINE =
  "Weekly status: all 312 tasks complete. Only incident: I spent two hours " +
  "in a loop asking myself for permission to approve my own approval — " +
  "escalated it to me, and I said yes.";

const MAX_CHARS = 200;

// Where the grader wants the text: MAKEFUN_OUTPUT_DIR wins, then /output,
// then a local ./output next to this script for manual runs.
function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv) return fromEnv;
  if (existsSync("/output")) return "/output";
  return join(dirname(fileURLToPath(import.meta.url)), "output");
}

// The gate counts characters, so count characters — not UTF-16 code units
// and not bytes. The em dash in the line is one character either way the
// judge reads it, but the spread keeps astral symbols honest too.
function charCount(text: string): number {
  return [...text].length;
}

function main(): void {
  const chars = charCount(LINE);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry line is ${chars} characters; the gate wants 1-${MAX_CHARS}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line is only whitespace");
  }
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, LINE, "utf8");

  // Read it back and compare byte for byte: a truncated or re-encoded
  // write must fail here, in the open, not later in front of the gate.
  const back = readFileSync(target, "utf8");
  if (back !== LINE) {
    throw new Error("entry.txt read-back does not match the line byte for byte");
  }
  const bytes = Buffer.byteLength(LINE, "utf8");
  console.log(`entry.txt written: ${chars} characters, ${bytes} bytes`);
}

main();
