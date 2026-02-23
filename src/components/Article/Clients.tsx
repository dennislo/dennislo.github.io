import React from "react";
import ExternalLink from "../ExternalLink";

const Clients = () => (
  <section className="clients">
    <header>
      <h2>I&apos;ve worked with clients from:</h2>
    </header>
    <ul>
      <li>
        <ExternalLink href="https://dlo.wtf">Advertising & Media</ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://dlo.wtf">HR & Recruitment</ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://dlo.wtf">Retail & Consumer</ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://dlo.wtf">Science & Education</ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://dlo.wtf">Finance & Banking</ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://dlo.wtf">
          IT & Telecommunications
        </ExternalLink>
      </li>
    </ul>
  </section>
);

export default Clients;
