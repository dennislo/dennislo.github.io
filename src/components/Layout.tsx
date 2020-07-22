/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./Header"
import Bobba from "./icons/Bobba"
import "./Generated.css"
import styles from "./Layout.module.scss"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className={styles.contentContainer}>
        <div className={styles.contentContainerLeft}>
          <Bobba />
        </div>
        <div className={styles.contentContainerRight}>
          <main>{children}</main>
          <footer>© {new Date().getFullYear()}, Built with ❤</footer>
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
