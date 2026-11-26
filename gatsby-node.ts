import type { GatsbyNode } from "gatsby";
import { createLocalePages } from "./src/gatsby/createLocalePages";

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
  createLocalePages({ page, actions });
};

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  plugins,
}) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      }),
    ],
  });
};
