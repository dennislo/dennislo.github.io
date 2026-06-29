import type { GatsbyNode } from "gatsby";
import { createLocalePages } from "./src/gatsby/createLocalePages";

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
  createLocalePages({ page, actions });
};
