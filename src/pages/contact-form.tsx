import React from "react";
import Layout from "../components/Layout/Layout";
import ContactForm from "../components/ContactForm/ContactForm";
import { Head as SharedHead } from "../components/Head/Head";
import { buildWebPageSchema } from "../schemas";
import { routes, siteConfig } from "../config";

const ContactFormPage = () => (
  <Layout>
    <ContactForm />
  </Layout>
);

export default ContactFormPage;

export const Head = () => {
  const schemas = [
    buildWebPageSchema({
      url: `${siteConfig.siteUrl}${routes.contactForm}`,
      name: "Contact — DLO",
      description: "Send a message to Dennis Lo",
    }),
  ];
  return (
    <>
      <SharedHead
        title="Contact — DLO"
        description="Send a message to Dennis Lo"
        schemas={schemas}
      />
      <link rel="alternate" type="text/markdown" href="/contact-form.md" />
    </>
  );
};
