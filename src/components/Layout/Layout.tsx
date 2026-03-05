import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "../../context/ThemeContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <ThemeToggle />
        {children}
      </div>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
