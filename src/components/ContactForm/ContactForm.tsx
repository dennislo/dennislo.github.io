import React, { useMemo, useRef, useState } from "react";
import { Link } from "gatsby";
import { useForm, ValidationError } from "@formspree/react";

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
      if (trimmed.length > 500)
        return "Message must be 500 characters or fewer.";
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

const inputClass =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200";

const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

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

  const fieldRefs = useMemo<
    Record<FieldName, React.RefObject<HTMLInputElement | HTMLTextAreaElement>>
  >(
    () => ({
      firstName: firstNameRef,
      lastName: lastNameRef,
      mobile: mobileRef,
      email: emailRef,
      message: messageRef,
    }),
    [],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center max-w-md"
          role="alert"
        >
          <p className="text-green-800 dark:text-green-200 text-lg mb-4">
            Thank you for your message! I&apos;ll get back to you soon.
          </p>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const hasServerErrors = state.errors !== null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-8 sm:p-12 md:p-16 lg:p-24">
      <div className="max-w-xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
        >
          &larr; Back
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Contact Me
        </h1>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {/* Honeypot */}
          <input
            type="text"
            name="_gotcha"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
          />

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First Name
            </label>
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
              className={inputClass}
            />
            {errors.firstName && (
              <span
                id="firstName-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
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
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last Name
            </label>
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
              className={inputClass}
            />
            {errors.lastName && (
              <span
                id="lastName-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
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

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className={labelClass}>
              Mobile Number
            </label>
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
              className={inputClass}
            />
            {errors.mobile && (
              <span
                id="mobile-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
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

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
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
              className={inputClass}
            />
            {errors.email && (
              <span
                id="email-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
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
          <div>
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <textarea
              ref={fieldRefs.message as React.RefObject<HTMLTextAreaElement>}
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows={5}
              aria-invalid={errors.message !== null ? "true" : undefined}
              aria-describedby={
                errors.message !== null ? "message-error" : undefined
              }
              className={inputClass}
            />
            {errors.message && (
              <span
                id="message-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
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
            disabled={state.submitting}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {state.submitting ? "Sending..." : "Send Message"}
          </button>

          {hasServerErrors && (
            <p
              className="text-sm text-red-600 dark:text-red-400 text-center"
              role="alert"
            >
              There was a problem sending your message. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
