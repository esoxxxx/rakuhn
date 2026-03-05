const fs = require("fs");
const path = require("path");

module.exports = function() {
  const giftsDir = path.join(__dirname, "../assets/img/gifts");
  if (!fs.existsSync(giftsDir)) return {};

  const folders = fs.readdirSync(giftsDir);
  const galleryData = {};

  folders.forEach(folder => {
    const folderPath = path.join(giftsDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const images = fs.readdirSync(folderPath)
                       .filter(file => /\.(jpg|jpeg|png|webp|JPG)$/i.test(file));
      galleryData[folder] = images; // Key ist der Ordnername (z.B. "racoon")
    }
  });

  return galleryData;
};