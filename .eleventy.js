const {
  EleventyRenderPlugin,
  EleventyHtmlBasePlugin
} = require("@11ty/eleventy");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');

  /**
   * For the Blog section
   * 1. Flatten the year directory and its immediate subdirectory in the url
   * /blog/2018/foo/index.html --> /blog/2018-foo/index
   */
  eleventyConfig.addFilter('blogPermalink', function (filePath = '') {
    const withoutFileName = filePath.split('/').slice(0, -1).join('/');
    const yearRegex = /([0-9]{4})\//;

    return withoutFileName.replace(yearRegex, "$1-");
  });
  eleventyConfig.addPassthroughCopy('src/blog', {
    filter: ['**/*.!(md|njk|html|json)'],
    rename: (filePath) => {
      const fn = eleventyConfig.getFilter('blogPermalink');
      const fileName = filePath.split('/').pop();
      if (!fileName) {
        return filePath;
      }
      const targetDir = fn(filePath);
      return `${targetDir}/${fileName}`;
    }
  });

   // NOTE: the passthrough behaviour does not seem to work in development
  //  for the assets files inside blog article directories
  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(bundlerPlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addCollection('blogArticles', (collection) => {
    const blogArticles = collection.getFilteredByGlob(["src/blog/**/index.md", "src/blog/**/index.njk"])
      .filter(article => article.data.published);
    blogArticles.sort((a, b) => {
      return b.data.page.date - a.data.page.date;
    });
    return blogArticles;
  });

  eleventyConfig.addFilter("readableDate", dateStr => {
    return DateTime.fromFormat(dateStr, 'yyyy-MM-dd').toFormat("dd LLL yyyy");
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    // breaks: true,
    // linkify: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    dir: {
      input: "src",
      includes: "_includes",
      output: "build"
    },
    // pathPrefix: '/prefix/'
  };
};
