import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `who is dlo`,
    siteUrl: `https://www.yourdomain.tld`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-styled-components", "gatsby-plugin-image", "gatsby-plugin-sitemap", "gatsby-plugin-sharp", "gatsby-transformer-sharp", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "images",
      "path": "./src/images/"
    },
    __key: "images"
  },
  {
    resolve: `gatsby-plugin-segment-js`,
    options: {
      // your segment write key for your production environment
      // when process.env.NODE_ENV === 'production'
      // required; non-empty string
      prodKey: `N6Rz9B3AkToctyEBDMcGGmD7z8pkSHLo`,

      // if you have a development env for your segment account, paste that key here
      // when process.env.NODE_ENV === 'development'
      // optional; non-empty string
      devKey: 'SEGMENT_DEV_WRITE_KEY',

      // Boolean indicating if you want this plugin to perform any automated analytics.page() calls
      // at all, or not.
      // If set to false, see below on how to track pageviews manually.
      //
      // This plugin will attempt to intelligently prevent duplicate page() calls.
      //
      // Default: true
      trackPage: true,

      // Boolean indicating if you want this plugin to perform a page() call immediately once the snippet
      // is loaded.
      //
      // You might want to disable this if you *only* want page() calls to occur upon Client-side routing
      // updates. See `trackPageOnRouteUpdate` option.
      //
      // This plugin will still attempt to intelligently prevent duplicate page() calls.
      //
      // Default: true
      trackPageImmediately: true,
    }
  }]
};

export default config;
