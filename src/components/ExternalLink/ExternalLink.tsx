import React from "react";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const ExternalLink = ({
  href,
  title,
  "aria-label": ariaLabel,
  children,
  className,
  style,
  onClick,
}: ExternalLinkProps) => (
  <a
    href={href}
    title={title}
    aria-label={ariaLabel}
    rel="noopener noreferrer"
    target="_blank"
    className={className}
    style={style}
    onClick={onClick}
  >
    {children}
  </a>
);

export default ExternalLink;
