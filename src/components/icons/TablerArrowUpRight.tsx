import React from "react";

interface TablerIconProps {
  className?: string;
}

const TablerArrowUpRight: React.FC<TablerIconProps> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 7l-10 10" />
    <path d="M8 7l9 0l0 9" />
  </svg>
);

export default TablerArrowUpRight;
