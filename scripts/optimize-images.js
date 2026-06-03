const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '../src/assets/img');
const SRC_DIR = path.join(__dirname, '../src');
const WEBP_QUALITY = 82;
const MAX_WIDTH = 1600;
const SKIP_BELOW_KB = 200;

// Extensions to convert
const INPUT_EXTS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

function walkDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1);
}

async function convertImages() {
  console.log('\n📸 Phase A – Bilder zu WebP konvertieren\n');

  const allFiles = walkDir(IMG_DIR);
  const targets = allFiles.filter(f => INPUT_EXTS.includes(path.extname(f)));

  let totalBefore = 0;
  let totalAfter = 0;
  const converted = [];

  for (const src of targets) {
    const sizeBefore = fs.statSync(src).size;

    const webpPath = src.replace(/\.[^.]+$/, '.webp');
    const isSmall = sizeBefore < SKIP_BELOW_KB * 1024;

    if (isSmall) {
      // Kleine Dateien: EXIF-Rotation anwenden, nur Format konvertieren
      await sharp(src).rotate().webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    } else {
      await sharp(src)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);
    }

    const sizeAfter = fs.statSync(webpPath).size;
    const saving = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(0);

    totalBefore += sizeBefore;
    totalAfter += sizeAfter;
    converted.push({ src, webpPath });

    console.log(`  ✅ ${path.basename(src).padEnd(60)} ${kb(sizeBefore).padStart(7)} KB → ${kb(sizeAfter).padStart(7)} KB  (-${saving}%)`);
  }

  const totalSaving = totalBefore > 0
    ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)
    : 0;
  console.log(`\n  Gesamt: ${kb(totalBefore)} KB → ${kb(totalAfter)} KB  (-${totalSaving}%)\n`);

  return converted;
}

function updateReferences() {
  console.log('🔗 Phase B – Dateireferenzen aktualisieren\n');

  function walkSrc(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory() && !entry.startsWith('_site') && entry !== 'node_modules') {
        files = files.concat(walkSrc(full));
      } else if (/\.(md|njk)$/.test(entry)) {
        files.push(full);
      }
    }
    return files;
  }

  const textFiles = walkSrc(SRC_DIR);
  let updatedCount = 0;

  for (const file of textFiles) {
    const original = fs.readFileSync(file, 'utf8');
    // Replace extensions in src="...", href="...", icon: "...", src: "..." contexts
    const updated = original.replace(
      /(\.(jpg|jpeg|JPG|JPEG|png|PNG))(?=[\"'\s])/g,
      '.webp'
    );
    if (updated !== original) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`  ✅ Aktualisiert: ${path.relative(SRC_DIR, file)}`);
      updatedCount++;
    }
  }

  if (updatedCount === 0) {
    console.log('  Keine Änderungen nötig.\n');
  } else {
    console.log(`\n  ${updatedCount} Datei(en) aktualisiert.\n`);
  }
}

function deleteOriginals(converted) {
  console.log('🗑  Phase C – Originale löschen\n');

  for (const { src } of converted) {
    fs.unlinkSync(src);
    console.log(`  🗑  Gelöscht: ${path.relative(IMG_DIR, src)}`);
  }

  console.log(`\n  ${converted.length} Original(e) gelöscht.\n`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  rakuhn – Bildoptimierung (JPEG/PNG → WebP)');
  console.log('═══════════════════════════════════════════════════');

  const converted = await convertImages();
  updateReferences();
  deleteOriginals(converted);

  console.log('✨ Fertig! Alle Bilder sind jetzt WebP-optimiert.');
  console.log('   Originale können via `git checkout src/assets/img` wiederhergestellt werden.\n');
}

main().catch(err => {
  console.error('Fehler:', err);
  process.exit(1);
});
