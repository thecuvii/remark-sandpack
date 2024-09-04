const { remarkSandpack } = require('remark-sandpack');

// https://nextjs.org/docs/advanced-features/using-mdx
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkSandpack, { componentName: ['Sandpack', 'CustomSandpack'] }]],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

module.exports = withMDX({
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
});
