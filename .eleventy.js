module.exports = function(eleventyConfig) {
  // Statische Ordner einfach kopieren
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("gifts", function(collection) {
    return collection
      .getFilteredByTag("gift")
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection("testimonials", function(collection) {
    return collection
      .getFilteredByTag("testimonial")
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection("products", function(collection) {
    return collection
      .getFilteredByTag("product")
      .sort((a, b) => a.data.order - b.data.order);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};