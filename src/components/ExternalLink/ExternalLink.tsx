import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

const ExternalLink = ({
  href,
  title,
  children,
  className,
}: ExternalLinkProps) => (
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
