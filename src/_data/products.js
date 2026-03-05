const fs = require("fs");
const path = require("path");

module.exports = function() {
  const productsDir = path.join(__dirname, "../assets/img/products");
  if (!fs.existsSync(productsDir)) return {};

  const folders = fs.readdirSync(productsDir);
  const galleryData = {};

  folders.forEach(folder => {
    const folderPath = path.join(productsDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const images = fs.readdirSync(folderPath)
                       .filter(file => /\.(jpg|jpeg|png|webp|JPG)$/i.test(file));
      galleryData[folder] = images; // Key ist der Ordnername (z.B. "racoon")
    }
  });

  return galleryData;
};