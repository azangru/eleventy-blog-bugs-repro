This repository is a simple reproduction case for several Eleventy bugs.

# Structure

The repository contains a `blog` directory with two dummy articles, both inside of the `2023` directory:

```
src/
├─ blog/
│  ├─ 2023/
│  │  ├─ article-one/
│  │  │  ├─ index.md
|  |  |  ├─ img.avif
|  |  |  ├─ styles.css
│  │  ├─ article-two/
│  │  │  ├─ index.md
```

The desired outcome is that:
- Asset files for an article are located in the same directory as the article file itself
- The url should combine the year with the directory name of the article; I do not need the year to be a full directory in the pathname. Example: `/blog/2023/article-one/` should become `/blog/2023-article-one`

To this effect, relevant settings have been set in the `.eleventy.js` file. See [this discussion](https://github.com/11ty/eleventy/discussions/3043) for more details.

The setup partly works; however, there are several problems.

# Observed Problems

- If Eleventy server is started with the `--ignore-initial` option (e.g. using the `eleventy --ignore-initial --incremental --serve` command), then the `/blog` page will not show the list of blog articles. It seems that the `--ignore-initial` option prevents the `collections.blogArticles` in `blog.njk` file from getting the full list of articles.
- The passthrough copy emulation (enabled with `eleventyConfig.setServerPassthroughCopyBehavior("passthrough");`) does not seem to work. The default behavior, which is `copy`, works correctly
- Eleventy does not detect changes in passthrough files. For example, updating the `src/blog/2023/article-one/styles.css` file while Eleventy server is running does not re-copy this file.
- If I add a `pathPrefix` to `eleventyConfig`, the dev sever redirects to a page without the prefix if the url does not contain a trailing slash. For example:
  - No prefix set in the config; url `/blog/2023-article-one/` (with a trailing slash) shows a page correctly
  - No prefix set in the config; url `/blog/2023-article-one` (without a trailing slash) redirects to `/blog/2023-article-one/` and shows a page correctly
  - Prefix set in the config; url `/prefix/blog/2023-article-one/` (with a trailing slash) shows a page correctly
  - _(BUG)_ Prefix set in the config; url `/prefix/blog/2023-article-one` (without a trailing slash) redirects to `/blog/2023-article-one/` (prefix lost), and shows a 404 page
