// Compresse une vidéo d'ambiance pour le hero (voir .claude/skills/hero-video).
// Usage : npm run hero-video -- <source.mp4> [début_s=0] [durée_s=14]
// Sorties : public/videos/hero-720.mp4, hero-720.webm, hero-480.mp4, hero-poster.jpg, hero-poster.webp
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [src, start = '0', duration = '14'] = process.argv.slice(2);
if (!src) {
  console.error('Usage : npm run hero-video -- <source.mp4> [début_s] [durée_s]');
  process.exit(1);
}
const out = fileURLToPath(new URL('../public/videos/', import.meta.url));
mkdirSync(out, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const cut = ['-ss', start, '-t', duration, '-i', src, '-an'];
// Couleurs légèrement réchauffées et désaturées pour coller à la DA (lumière naturelle, jamais froide).
const grade = 'eq=saturation=0.88:gamma=1.02,colorbalance=rs=0.03:bs=-0.03';

const jobs = [
  ['hero-720.mp4', [...cut, '-vf', `scale=-2:720,fps=30,${grade}`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'], 2.5],
  ['hero-480.mp4', [...cut, '-vf', `scale=-2:480,fps=30,${grade}`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'], 1.2],
  ['hero-720.webm', [...cut, '-vf', `scale=-2:720,fps=30,${grade}`, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1'], 2],
  ['hero-poster.jpg', ['-ss', start, '-i', src, '-frames:v', '1', '-vf', `scale=1600:-2,${grade}`, '-q:v', '4'], 0.15],
  ['hero-poster.webp', ['-ss', start, '-i', src, '-frames:v', '1', '-vf', `scale=1600:-2,${grade}`, '-quality', '72'], 0.15],
];

let over = 0;
for (const [name, args, budgetMb] of jobs) {
  ff([...args, `${out}${name}`]);
  const mb = statSync(`${out}${name}`).size / 1e6;
  const ok = mb <= budgetMb;
  if (!ok) over++;
  console.log(`${ok ? 'OK ' : 'TROP LOURD'} ${name} : ${mb.toFixed(2)} Mo (budget ${budgetMb} Mo)`);
}
if (over) console.log('→ Raccourcir le clip (durée) ou augmenter le CRF de 2, puis relancer.');
