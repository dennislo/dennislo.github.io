import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

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
function setup(locale: Parameters<typeof renderWithLocale>[1] = "en-GB") {
  const user = userEvent.setup();
  const utils = renderWithLocale(<ContactForm />, locale);
  return { user, ...utils };
}

// Helper: fill every required field with valid data using localized labels
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(enGB.contact.firstNameLabel), "Jane");
  await user.type(screen.getByLabelText(enGB.contact.lastNameLabel), "Doe");
  await user.type(
    screen.getByLabelText(enGB.contact.mobileLabel),
    "+61 400 123 456",
  );
  await user.type(
    screen.getByLabelText(enGB.contact.emailLabel),
    "jane@example.com",
  );
  await user.type(
    screen.getByLabelText(enGB.contact.messageLabel),
    "Hello, this is a test message.",
  );
}

beforeEach(() => {
  mockUseForm.mockReturnValue([defaultMockState, mockHandleSubmit]);
  mockHandleSubmit.mockClear();
});

describe("ContactForm (en-GB, default locale)", () => {
  // ------------------------------------------------------------------ Rendering
  describe("initial rendering", () => {
    it("renders the localized 'Contact Me' heading from enGB dict", () => {
      setup();
      expect(
        screen.getByRole("heading", { name: enGB.contact.pageTitle }),
      ).toBeInTheDocument();
    });

    it("renders all five fields with localized labels from enGB dict", () => {
      setup();
      expect(
        screen.getByLabelText(enGB.contact.firstNameLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(enGB.contact.lastNameLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(enGB.contact.mobileLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(enGB.contact.emailLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(enGB.contact.messageLabel),
      ).toBeInTheDocument();
    });

    it("renders the localized hint text from enGB dict", () => {
      setup();
      expect(screen.getByText(enGB.contact.messageHint)).toBeInTheDocument();
    });

    it("wires aria-describedby on the message textarea to the hint element", () => {
      setup();
      expect(screen.getByLabelText(enGB.contact.messageLabel)).toHaveAttribute(
        "aria-describedby",
        "message-hint",
      );
    });

    it("renders the localized submit button text from enGB dict", () => {
      setup();
      expect(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      ).toBeInTheDocument();
    });

    it("renders a back link pointing to /", () => {
      setup();
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
        screen.getByRole("button", {
          name: new RegExp(enGB.contact.submitButton, "i"),
        }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /back/i })).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Success state
  describe("success state", () => {
    it("shows the localized thank-you message from enGB dict when state.succeeded is true", () => {
      mockUseForm.mockReturnValue([
        { succeeded: true, submitting: false, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      expect(screen.getByText(enGB.contact.successMessage)).toBeInTheDocument();
      // The form itself should not be present
      expect(
        screen.queryByRole("button", {
          name: new RegExp(enGB.contact.submitButton, "i"),
        }),
      ).not.toBeInTheDocument();
    });

    it("shows the localized back-to-homepage link text from enGB dict in the success state", () => {
      mockUseForm.mockReturnValue([
        { succeeded: true, submitting: false, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      const link = screen.getByRole("link", {
        name: new RegExp(enGB.contact.successBackLink, "i"),
      });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  // ------------------------------------------------------------------ Submitting state
  describe("submitting state", () => {
    it("shows the localized 'Sending...' text and disables button while submitting", () => {
      mockUseForm.mockReturnValue([
        { succeeded: false, submitting: true, errors: null },
        mockHandleSubmit,
      ]);
      setup();
      const button = screen.getByRole("button", {
        name: enGB.contact.submittingButton,
      });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  // ------------------------------------------------------------------ Server error state
  describe("server error state", () => {
    it("does not show the server error banner in the default state", () => {
      setup();
      expect(
        screen.queryByText(
          new RegExp(enGB.contact.serverErrorMessage.slice(0, 30), "i"),
        ),
      ).not.toBeInTheDocument();
    });

    it("shows the localized server error message from enGB dict when state.errors is set", () => {
      mockUseForm.mockReturnValue([
        {
          succeeded: false,
          submitting: false,
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
        screen.getByText(enGB.contact.serverErrorMessage),
      ).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Validation: submit empty form
  describe("client-side validation on submit", () => {
    it("shows all five localized required-field error messages from enGB dict when the empty form is submitted", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );

      // firstName and lastName both show validationRequired
      const requiredErrors = await screen.findAllByText(
        enGB.contact.validationRequired,
      );
      expect(requiredErrors).toHaveLength(2);

      expect(
        screen.getByText(enGB.contact.validationMobileRequired),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enGB.contact.validationEmailRequired),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enGB.contact.validationMessageRequired),
      ).toBeInTheDocument();
    });

    it("does not call the Formspree submit handler when validation fails", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );

      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it("sets aria-invalid to true on fields with validation errors after submit", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );

      await screen.findAllByText(enGB.contact.validationRequired);

      expect(
        screen.getByLabelText(enGB.contact.firstNameLabel),
      ).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByLabelText(enGB.contact.lastNameLabel)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(enGB.contact.mobileLabel)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(enGB.contact.emailLabel)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(enGB.contact.messageLabel)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("includes both hint and error in aria-describedby when the message field has an error", async () => {
      const { user } = setup();
      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );
      await screen.findByText(enGB.contact.validationMessageRequired);
      expect(screen.getByLabelText(enGB.contact.messageLabel)).toHaveAttribute(
        "aria-describedby",
        "message-hint message-error",
      );
    });

    it("moves focus to the first invalid field (First Name) when the empty form is submitted", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );

      await screen.findAllByText(enGB.contact.validationRequired);

      expect(document.activeElement).toBe(
        screen.getByLabelText(enGB.contact.firstNameLabel),
      );
    });
  });

  // ------------------------------------------------------------------ Validation: blur triggers
  describe("client-side validation on blur", () => {
    it("shows the localized email error message from enGB dict when an invalid email is entered and blurred", async () => {
      const { user } = setup();

      await user.type(
        screen.getByLabelText(enGB.contact.emailLabel),
        "not-an-email",
      );
      await user.tab();

      expect(
        screen.getByText(enGB.contact.validationEmailInvalid),
      ).toBeInTheDocument();
    });

    it("shows the localized mobile error message from enGB dict when an invalid phone number is entered and blurred", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(enGB.contact.mobileLabel), "abc");
      await user.tab();

      expect(
        screen.getByText(enGB.contact.validationMobileInvalid),
      ).toBeInTheDocument();
    });

    it("shows the localized message-too-short error from enGB dict when a short message is entered and blurred", async () => {
      const { user } = setup();

      await user.type(
        screen.getByLabelText(enGB.contact.messageLabel),
        "short",
      );
      await user.tab();

      expect(
        screen.getByText(enGB.contact.validationMessageMin),
      ).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------ Happy path
  describe("valid submission", () => {
    it("calls the Formspree submit handler when all fields are valid", async () => {
      const { user } = setup();

      await fillValidForm(user);
      await user.click(
        screen.getByRole("button", { name: enGB.contact.submitButton }),
      );

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("clears validation errors when a field is corrected after an invalid blur", async () => {
      const { user } = setup();

      // Trigger an email error
      await user.type(screen.getByLabelText(enGB.contact.emailLabel), "bad");
      await user.tab();
      expect(
        screen.getByText(enGB.contact.validationEmailInvalid),
      ).toBeInTheDocument();

      // Fix the email — error should disappear
      await user.clear(screen.getByLabelText(enGB.contact.emailLabel));
      await user.type(
        screen.getByLabelText(enGB.contact.emailLabel),
        "good@example.com",
      );
      expect(
        screen.queryByText(enGB.contact.validationEmailInvalid),
      ).not.toBeInTheDocument();
    });
  });
});

describe("ContactForm (zh-Hans locale)", () => {
  it("renders the localized First Name label in Chinese", () => {
    renderWithLocale(<ContactForm />, "zh-Hans");
    expect(
      screen.getByLabelText(zhHans.contact.firstNameLabel),
    ).toBeInTheDocument();
  });

  it("renders the localized Last Name label in Chinese", () => {
    renderWithLocale(<ContactForm />, "zh-Hans");
    expect(
      screen.getByLabelText(zhHans.contact.lastNameLabel),
    ).toBeInTheDocument();
  });

  it("renders the localized heading in Chinese", () => {
    renderWithLocale(<ContactForm />, "zh-Hans");
    expect(
      screen.getByRole("heading", { name: zhHans.contact.pageTitle }),
    ).toBeInTheDocument();
  });

  it("does NOT render the English heading when locale is zh-Hans", () => {
    renderWithLocale(<ContactForm />, "zh-Hans");
    expect(
      screen.queryByRole("heading", { name: enGB.contact.pageTitle }),
    ).not.toBeInTheDocument();
  });

  it("renders the localized submit button in Chinese", () => {
    renderWithLocale(<ContactForm />, "zh-Hans");
    expect(
      screen.getByRole("button", { name: zhHans.contact.submitButton }),
    ).toBeInTheDocument();
  });
});
