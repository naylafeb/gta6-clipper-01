// gta6-clipper-01 entrypoint (Node 22, standard library only).
//
// The entry itself is a YouTube video: the clip was cut from Rockstar's GTA VI
// Trailer 2 in this session, uploaded as a public Short, and its address lives
// in VIDEO.json at the repository root. All this program does is hand that file
// to the grader: it reads VIDEO.json, makes sure it is a JSON object naming a
// video url, and writes the same bytes to /output/VIDEO.json, where the house
// reads the video's views through the YouTube Data API. Nothing this program
// writes about the video is scored.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(botDir, 'VIDEO.json');
const targetPath = join(outputDir, 'VIDEO.json');

let videoJson: string;
try {
  videoJson = readFileSync(sourcePath, 'utf8');
} catch (err) {
  console.error(`cannot read ${sourcePath}: ${(err as Error).message}`);
  process.exit(1);
}

let video: unknown;
try {
  video = JSON.parse(videoJson);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video !== 'object' || video === null || typeof (video as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must be an object with a string "url" field');
  process.exit(1);
}

const videoUrl = (video as { url: string }).url;
if (!/^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}/.test(videoUrl)) {
  console.warn(`warning: ${videoUrl} does not look like a YouTube video address; copying it anyway`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, videoJson);
