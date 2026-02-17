import React from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  title,
  children,
  className,
}) => (
  <a
    href={href}
    title={title}
    rel="noopener noreferrer"
    target="_blank"
    className={className}
  >
    {children}
  </a>
);

export default ExternalLink;
