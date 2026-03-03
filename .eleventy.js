module.exports = function(eleventyConfig) {
  // Statische Ordner einfach kopieren
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};