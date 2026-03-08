import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

// Mock Gatsby's Link as a plain anchor so we don't need a Gatsby runtime
jest.mock("gatsby", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Default mock state returned by useForm
const mockHandleSubmit = jest.fn();
const defaultMockState = { succeeded: false, submitting: false, errors: null };

jest.mock("@formspree/react", () => ({
  useForm: jest.fn(() => [defaultMockState, mockHandleSubmit]),
  // ValidationError renders nothing when errors array is empty — keep it simple
  ValidationError: () => null,
}));

// Re-import the mocked module so we can override it per-test
import { useForm } from "@formspree/react";
const mockUseForm = useForm as jest.Mock;

// Helper: render the form and return userEvent instance
function setup() {
  const user = userEvent.setup();
  const utils = render(<ContactForm />);
  return { user, ...utils };
}

// Helper: fill every required field with valid data
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("First Name"), "Jane");
  await user.type(screen.getByLabelText("Last Name"), "Doe");
  await user.type(screen.getByLabelText("Mobile Number"), "+61 400 123 456");
  await user.type(screen.getByLabelText("Email Address"), "jane@example.com");
  await user.type(
    screen.getByLabelText("Message"),
    "Hello, this is a test message.",
  );
}

beforeEach(() => {
  mockUseForm.mockReturnValue([defaultMockState, mockHandleSubmit]);
  mockHandleSubmit.mockClear();
});

describe("ContactForm", () => {
  // ------------------------------------------------------------------ Rendering
  describe("initial rendering", () => {
    it('renders the "Contact Me" heading', () => {
      setup();
      expect(
        screen.getByRole("heading", { name: "Contact Me" }),
      ).toBeInTheDocument();
    });

    it("renders all five fields with correct labels", () => {
      setup();
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Mobile Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it('renders the submit button with text "Send Message"', () => {
      setup();
      expect(
        screen.getByRole("button", { name: "Send Message" }),
      ).toBeInTheDocument();
    });

    it("renders a back link pointing to /", () => {
      setup();
      // The back link contains an arrow character and "Back"
      const backLink = screen.getByRole("link", { name: /back/i });
      expect(backLink).toHaveAttribute("href", "/");
    });

    it("renders the hidden honeypot field", () => {
      const { container } = setup();
      const honeypot = container.querySelector('input[name="_gotcha"]');
      expect(honeypot).not.toBeNull();
      if (!honeypot) {
        throw new Error("Honeypot field not found");
      }
      expect(honeypot).toBeInTheDocument();
      expect(honeypot).toHaveAttribute("aria-hidden", "true");
    });

    it("renders the form and back link", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /back/i })).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Success state
  describe("success state", () => {
    it("shows a thank-you message when state.succeeded is true", () => {
      mockUseForm.mockReturnValue([
        { succeeded: true, submitting: false, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      expect(
        screen.getByText(/thank you for your message/i),
      ).toBeInTheDocument();
      // The form itself should not be present
      expect(
        screen.queryByRole("button", { name: /send message/i }),
      ).not.toBeInTheDocument();
    });

    it("shows a back-to-homepage link in the success state", () => {
      mockUseForm.mockReturnValue([
        { succeeded: true, submitting: false, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      const link = screen.getByRole("link", { name: /back to homepage/i });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  // ------------------------------------------------------------------ Submitting state
  describe("submitting state", () => {
    it('shows "Sending..." on the button and disables it while submitting', () => {
      mockUseForm.mockReturnValue([
        { succeeded: false, submitting: true, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      const button = screen.getByRole("button", { name: "Sending..." });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  // ------------------------------------------------------------------ Server error state
  describe("server error state", () => {
    it("does not show the server error banner in the default state", () => {
      setup();
      expect(
        screen.queryByText(/there was a problem sending your message/i),
      ).not.toBeInTheDocument();
    });

    it("shows a general error message when state.errors is a SubmissionError", () => {
      mockUseForm.mockReturnValue([
        {
          succeeded: false,
          submitting: false,
          // Non-null errors object simulates a SubmissionError from Formspree
          errors: {
            kind: "error",
            getFormErrors: () => [],
            getFieldErrors: () => [],
            getAllFieldErrors: () => [],
          },
        },
        mockHandleSubmit,
      ]);
      setup();
      expect(
        screen.getByText(/there was a problem sending your message/i),
      ).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Validation: submit empty form
  describe("client-side validation on submit", () => {
    it("shows all five required-field error messages when the empty form is submitted", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Send Message" }));

      // firstName and lastName both show "This field is required."
      const requiredErrors = await screen.findAllByText(
        "This field is required.",
      );
      expect(requiredErrors).toHaveLength(2);

      expect(
        screen.getByText("Mobile number is required."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Email address is required."),
      ).toBeInTheDocument();
      expect(screen.getByText("Message is required.")).toBeInTheDocument();
    });

    it("does not call the Formspree submit handler when validation fails", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Send Message" }));

      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it("sets aria-invalid to true on fields with validation errors after submit", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Send Message" }));

      await screen.findAllByText("This field is required.");

      expect(screen.getByLabelText("First Name")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText("Last Name")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText("Mobile Number")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText("Email Address")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText("Message")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  // ------------------------------------------------------------------ Validation: blur triggers
  describe("client-side validation on blur", () => {
    it("shows an email error when an invalid email is entered and the field is blurred", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText("Email Address"), "not-an-email");
      await user.tab(); // move focus away to trigger blur

      expect(
        screen.getByText("Enter a valid email address."),
      ).toBeInTheDocument();
    });

    it("shows a mobile error when an invalid phone number is entered and the field is blurred", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText("Mobile Number"), "abc");
      await user.tab();

      expect(
        screen.getByText("Enter a valid phone number (e.g. +61 400 123 456)."),
      ).toBeInTheDocument();
    });

    it("shows a message error when a short message (<10 chars) is entered and the field is blurred", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText("Message"), "short");
      await user.tab();

      expect(
        screen.getByText("Message must be at least 10 characters."),
      ).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Happy path
  describe("valid submission", () => {
    it("calls the Formspree submit handler when all fields are valid", async () => {
      const { user } = setup();

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: "Send Message" }));

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("clears validation errors when a field is corrected after an invalid blur", async () => {
      const { user } = setup();

      // Trigger an email error
      await user.type(screen.getByLabelText("Email Address"), "bad");
      await user.tab();
      expect(
        screen.getByText("Enter a valid email address."),
      ).toBeInTheDocument();

      // Fix the email — error should disappear
      await user.clear(screen.getByLabelText("Email Address"));
      await user.type(
        screen.getByLabelText("Email Address"),
        "good@example.com",
      );
      expect(
        screen.queryByText("Enter a valid email address."),
      ).not.toBeInTheDocument();
    });
  });
});
