import React, { useMemo, useRef, useState } from "react";
import { Link } from "gatsby";
import { useForm, ValidationError } from "@formspree/react";
import "./ContactForm.css";

type FieldName = "firstName" | "lastName" | "mobile" | "email" | "message";

interface FormErrors {
  firstName: string | null;
  lastName: string | null;
  mobile: string | null;
  email: string | null;
  message: string | null;
}

interface FormTouched {
  firstName: boolean;
  lastName: boolean;
  mobile: boolean;
  email: boolean;
  message: boolean;
}

interface FormValues {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  message: string;
}

function validateField(name: FieldName, value: string): string | null {
  switch (name) {
    case "firstName":
    case "lastName": {
      const trimmed = value.trim();
      if (trimmed.length === 0) return "This field is required.";
      if (trimmed.length > 50) return "Must be 50 characters or fewer.";
      return null;
    }
    case "mobile": {
      if (value.trim().length === 0) return "Mobile number is required.";
      if (!/^\+?[\d\s\-()]{7,15}$/.test(value.trim()))
        return "Enter a valid phone number (e.g. +61 400 123 456).";
      return null;
    }
    case "email": {
      if (value.trim().length === 0) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Enter a valid email address.";
      return null;
    }
    case "message": {
      const trimmed = value.trim();
      if (trimmed.length === 0) return "Message is required.";
      if (trimmed.length < 10) return "Message must be at least 10 characters.";
      if (trimmed.length > 500) return "Message must be 500 characters or fewer.";
      return null;
    }
    default:
      return null;
  }
}

const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "mobile",
  "email",
  "message",
];

const ContactForm: React.FC = () => {
  const [state, handleFormspreeSubmit] = useForm("xykddnzg");

  const [values, setValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: null,
    lastName: null,
    mobile: null,
    email: null,
    message: null,
  });

  const [touched, setTouched] = useState<FormTouched>({
    firstName: false,
    lastName: false,
    mobile: false,
    email: false,
    message: false,
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs = useMemo<Record<FieldName, React.RefObject<HTMLInputElement | HTMLTextAreaElement>>>(
    () => ({
      firstName: firstNameRef,
      lastName: lastNameRef,
      mobile: mobileRef,
      email: emailRef,
      message: messageRef,
    }),
    [] // refs are stable
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      firstName: validateField("firstName", values.firstName),
      lastName: validateField("lastName", values.lastName),
      mobile: validateField("mobile", values.mobile),
      email: validateField("email", values.email),
      message: validateField("message", values.message),
    };
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      mobile: true,
      email: true,
      message: true,
    });

    const firstInvalidField = FIELD_ORDER.find((f) => newErrors[f] !== null);
    if (firstInvalidField) {
      fieldRefs[firstInvalidField].current?.focus();
      return false;
    }
    return true;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleFormspreeSubmit(values as unknown as Record<string, string>);
  };

  if (state.succeeded) {
    return (
      <div className="contact-form-container">
        <div className="contact-form-success" role="alert">
          <p>Thank you for your message! I&apos;ll get back to you soon.</p>
          <p>
            <Link to="/">Back to homepage</Link>
          </p>
        </div>
      </div>
    );
  }

  const hasServerErrors = state.errors !== null;

  return (
    <div className="contact-form-container">
      <Link to="/" className="contact-form-back">
        &larr; Back
      </Link>
      <h1>Contact Me</h1>
      <form
        className="contact-form"
        onSubmit={onSubmit}
        noValidate
      >
        {/* Honeypot field for spam protection */}
        <input
          type="text"
          name="_gotcha"
          className="contact-form-honeypot"
          data-testid="honeypot"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />

        {/* First Name */}
        <div className="contact-form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            ref={fieldRefs.firstName as React.RefObject<HTMLInputElement>}
            id="firstName"
            name="firstName"
            type="text"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={errors.firstName !== null ? "true" : undefined}
            aria-describedby={
              errors.firstName !== null ? "firstName-error" : undefined
            }
            autoComplete="given-name"
          />
          {errors.firstName && (
            <span
              id="firstName-error"
              className="contact-form-error"
              role="alert"
            >
              {errors.firstName}
            </span>
          )}
          <ValidationError
            prefix="First Name"
            field="firstName"
            errors={state.errors}
          />
        </div>

        {/* Last Name */}
        <div className="contact-form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            ref={fieldRefs.lastName as React.RefObject<HTMLInputElement>}
            id="lastName"
            name="lastName"
            type="text"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={errors.lastName !== null ? "true" : undefined}
            aria-describedby={
              errors.lastName !== null ? "lastName-error" : undefined
            }
            autoComplete="family-name"
          />
          {errors.lastName && (
            <span
              id="lastName-error"
              className="contact-form-error"
              role="alert"
            >
              {errors.lastName}
            </span>
          )}
          <ValidationError
            prefix="Last Name"
            field="lastName"
            errors={state.errors}
          />
        </div>

        {/* Mobile Number */}
        <div className="contact-form-field">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            ref={fieldRefs.mobile as React.RefObject<HTMLInputElement>}
            id="mobile"
            name="mobile"
            type="tel"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={errors.mobile !== null ? "true" : undefined}
            aria-describedby={
              errors.mobile !== null ? "mobile-error" : undefined
            }
            autoComplete="tel"
          />
          {errors.mobile && (
            <span
              id="mobile-error"
              className="contact-form-error"
              role="alert"
            >
              {errors.mobile}
            </span>
          )}
          <ValidationError
            prefix="Mobile"
            field="mobile"
            errors={state.errors}
          />
        </div>

        {/* Email Address */}
        <div className="contact-form-field">
          <label htmlFor="email">Email Address</label>
          <input
            ref={fieldRefs.email as React.RefObject<HTMLInputElement>}
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={errors.email !== null ? "true" : undefined}
            aria-describedby={
              errors.email !== null ? "email-error" : undefined
            }
            autoComplete="email"
          />
          {errors.email && (
            <span
              id="email-error"
              className="contact-form-error"
              role="alert"
            >
              {errors.email}
            </span>
          )}
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
          />
        </div>

        {/* Message */}
        <div className="contact-form-field">
          <label htmlFor="message">Message</label>
          <textarea
            ref={fieldRefs.message as React.RefObject<HTMLTextAreaElement>}
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={errors.message !== null ? "true" : undefined}
            aria-describedby={
              errors.message !== null ? "message-error" : undefined
            }
          />
          {errors.message && (
            <span
              id="message-error"
              className="contact-form-error"
              role="alert"
            >
              {errors.message}
            </span>
          )}
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </div>

        <button
          type="submit"
          className="contact-form-submit"
          disabled={state.submitting}
        >
          {state.submitting ? "Sending..." : "Send Message"}
        </button>

        {hasServerErrors && (
          <p className="contact-form-server-error" role="alert">
            There was a problem sending your message. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
