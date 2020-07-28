import React from "react"
import Layout from "../components/Layout/Layout"
import SEO from "../components/Seo/Seo"
import Article from "../components/Article/Article"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Article />
  </Layout>
)

export default IndexPage
