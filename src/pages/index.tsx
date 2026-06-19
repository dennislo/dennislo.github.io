import React from "react";
import Layout from "../components/Layout/Layout";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import GitHubActivity from "../components/GitHubActivity/GitHubActivity";
import Experience from "../components/Experience/Experience";
import Education from "../components/Education/Education";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import { Head as SharedHead } from "../components/Head/Head";
import {
  buildPersonSchema,
  buildWebSiteSchema,
  buildProfilePageSchema,
} from "../schemas";
import { siteConfig } from "../config";

const IndexPage = () => {
  return (
    <Layout>
      <SiteHeader />
      <Hero />
      <About />
      <Projects />
      <GitHubActivity />
      <Experience />
      <Education />
      <SiteFooter />
    </Layout>
  );
};

export default IndexPage;

export function Head() {
  const schemas = [
    buildPersonSchema(siteConfig),
    buildWebSiteSchema(siteConfig),
    buildProfilePageSchema(siteConfig),
  ];
  return (
    <>
      <SharedHead schemas={schemas} />
      <link rel="alternate" type="text/markdown" href="/index.md" />
    </>
  );
}
