import React from "react";
import Layout from "../components/Layout/Layout";
import ContactForm from "../components/ContactForm/ContactForm";

const ContactFormPage = () => (
  <Layout>
    <ContactForm />
  </Layout>
);

export default ContactFormPage;

export const Head = () => (
  <>
    <title>Contact — DLO</title>
    <meta name="description" content="Send a message to Dennis Lo" />
  </>
);
