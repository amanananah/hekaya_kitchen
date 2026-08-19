const fs = require('node:fs');
const path = require('node:path');

const sharpModulePath = process.argv[2];

if (!sharpModulePath) {
  throw new Error('Pass the path to the installed sharp module.');
}

const sharp = require(sharpModulePath);
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'icon.svg');
const output = path.join(root, 'assets');

fs.mkdirSync(output, { recursive: true });

async function generate() {
  await sharp(source).resize(1024, 1024).png().toFile(path.join(output, 'icon.png'));
  await sharp(source)
    .resize(768, 768)
    .extend({ top: 128, bottom: 128, left: 128, right: 128, background: '#274F3C' })
    .png()
    .toFile(path.join(output, 'adaptive-icon.png'));
  await sharp(source)
    .resize(360, 360)
    .extend({ top: 332, bottom: 332, left: 332, right: 332, background: '#F7F2E9' })
    .png()
    .toFile(path.join(output, 'splash-icon.png'));
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
