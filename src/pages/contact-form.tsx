import React from "react";
import Layout from "../components/Layout/Layout";
import ContactForm from "../components/ContactForm/ContactForm";

const ContactFormPage: React.FC = () => (
  <Layout>
    <ContactForm />
  </Layout>
);

export default ContactFormPage;

export const Head = () => (
  <>
    <html lang="en" />
    <title>Contact — DLO</title>
    <meta name="description" content="Send a message to Dennis Lo" />
  </>
);
