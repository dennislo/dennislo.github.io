import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import "../styles/index.css"
import "../../styles/theme.css"
import styled from "styled-components";
import { WHITE } from "../../constants/colours";
import { ThemeProvider } from "../../context/ThemeContext"
import ThemeToggle from "../ThemeToggle/ThemeToggle"

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
    <ThemeProvider>
      <ThemeToggle />
      <main>{children}</main>
      <Footer>
        © {new Date().getFullYear()}, Built with ❤️ using{" "}
        <Link to="https://www.gatsbyjs.org/">Gatsby.js</Link>
      </Footer>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
