import React from "react"
import Layout from "../components/Layout/Layout"
import SEO from "../components/Seo/Seo"
import Cat from "../components/Cat"
import styles from "./index.module.scss"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi there</h1>
    <p>Welcome to my personal homepage.</p>
    <div className={styles.imageContainer}>
      <Cat />
    </div>
  </Layout>
)

export default IndexPage
