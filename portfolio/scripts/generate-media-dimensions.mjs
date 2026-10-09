import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const imagesDirectory = join(process.cwd(), 'src/assets/images');
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif']);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(filePath)));
    } else if (supportedExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase())) {
      files.push(filePath);
    }
  }

  return files;
};

const dimensions = {};
for (const file of await walk(imagesDirectory)) {
  const metadata = await sharp(file).metadata();
  if (metadata.width && metadata.height) {
    dimensions[relative(imagesDirectory, file).replaceAll('\\', '/')] = {
      width: metadata.width,
      height: metadata.height,
    };
  }
}

await writeFile(
  join(process.cwd(), 'src/utils/mediaDimensions.js'),
  `const mediaDimensions = ${JSON.stringify(dimensions, null, 2)};\n\nexport default mediaDimensions;\n`
);
