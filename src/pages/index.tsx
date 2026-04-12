import React from "react";
import Layout from "../components/Layout/Layout";
import { Head as SharedHead } from "../components/Head/Head";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import Experience from "../components/Experience/Experience";
import Education from "../components/Education/Education";
import SiteFooter from "../components/SiteFooter/SiteFooter";

const IndexPage = () => {
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

export function Head() {
  return (
    <>
      <SharedHead />
      <link rel="alternate" type="text/markdown" href="/index.md" />
    </>
  );
}
