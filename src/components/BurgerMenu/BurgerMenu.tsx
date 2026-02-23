import React, { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import "./BurgerMenu.css";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      closeRef.current?.focus();
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }

    wasOpenRef.current = isOpen;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        className="burger-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
      >
        <span className="burger-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className={`burger-overlay ${isOpen ? "burger-overlay--open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav
        id="main-navigation"
        className={`burger-panel ${isOpen ? "burger-panel--open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          ref={closeRef}
          className="burger-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul className="burger-nav">
          <li>
            <Link to="/" onClick={closeMenu}>
              Homepage
            </Link>
          </li>
          <li>
            <Link to="/contact-form" onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default BurgerMenu;
