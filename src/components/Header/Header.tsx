import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"
import styles from "./Header.module.scss"

interface HeaderProps {
  siteTitle: string
}

const Header = ({ siteTitle }: HeaderProps) => (
  <header className={styles.headerContainer}>
    <div className={styles.headerContainerContent}>
      <h1 style={{ margin: 0 }}>
        <Link to="/">{siteTitle}</Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
