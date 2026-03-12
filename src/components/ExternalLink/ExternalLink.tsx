import React from "react";
import type { CSSProperties, ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ExternalLink = ({
  href,
  title,
  "aria-label": ariaLabel,
  children,
  className,
  style,
}: ExternalLinkProps) => (
  <a
    href={href}
    title={title}
    aria-label={ariaLabel}
    rel="noopener noreferrer"
    target="_blank"
    className={className}
    style={style}
  >
    {children}
  </a>
);

export default ExternalLink;
