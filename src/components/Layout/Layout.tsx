/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"
import Header from "../Header/Header"
import "../styles/index.scss"
import styles from "./Layout.module.scss"
import Sidebar from "../Sidebar/Sidebar"

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
          <Sidebar />
        </div>
        <div className={styles.contentContainerRight}>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with ❤️ using{" "}
            <Link to="https://www.gatsbyjs.org/">gatsby.js</Link>
          </footer>
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
