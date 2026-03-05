import * as React from "react";
import type { PageProps } from "gatsby";
import Layout from "../components/Layout/Layout";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import Experience from "../components/Experience/Experience";
import Education from "../components/Education/Education";
import SiteFooter from "../components/SiteFooter/SiteFooter";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <SiteHeader />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Education />
      <SiteFooter />
    </Layout>
  );
};

export default IndexPage;

export { Head } from "../components/Head/Head";
