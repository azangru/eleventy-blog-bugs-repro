module.exports = {
  layout: "layouts/post.njk",
  permalink(data) {
    return `${this.blogPermalink(data.page.filePathStem)}/`;
  },
};
