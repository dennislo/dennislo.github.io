import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout/Layout";
import Article from "../components/Article/Article";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <Article />
    </Layout>
  )
}

export default IndexPage


export { Head } from "../components/Head/Head";
