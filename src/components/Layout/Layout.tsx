import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import "../styles/index.css"
import styled from "styled-components";
import { WHITE } from "../../constants/colours";

interface LayoutProps {
  children: React.ReactNode
}

const Footer = styled.footer`
  color: ${WHITE};
  margin: 55px 0;
  text-align: center;
`

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <main>{children}</main>
      <Footer>
        © {new Date().getFullYear()}, Built with ❤️ using{" "}
        <Link to="https://www.gatsbyjs.org/">Gatsby.js</Link>
      </Footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
