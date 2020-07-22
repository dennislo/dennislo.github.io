import React from "react"

import Layout from "../components/Layout/Layout"
import Image from "../components/Image/Image"
import SEO from "../components/Seo/Seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Who the f*** is DLO?</h1>
    <p>Hi there, welcome to my personal homepage.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage
