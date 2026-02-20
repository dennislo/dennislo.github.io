# Contact Form Plan

## Overview

Add a **dedicated contact form page** at `/contact-form` that allows visitors to send a message to **dennis@dlo.wtf**. The form collects first name, last name, mobile number, email address, and a short message. All fields are required with client-side validation.

The contact form lives on its own Gatsby page (`src/pages/contact-form.tsx`) using the same `<Layout>` component as the homepage — so it shares the header, footer, theme toggle, and theme system.

---

## Architecture

### Form Submission: How the Data Gets to dennis@dlo.wtf

Since this site is deployed to **GitHub Pages** (a static host with no server-side processing), we need a third-party service to handle form submissions. Here are the recommended options:

#### Chosen: Formspree with `@formspree/react`

- **How it works:** The `@formspree/react` library provides a `useForm` hook and `<ValidationError>` component. The hook handles form submission (POSTing to `https://formspree.io/f/{form_id}`) and tracks submission state (`submitting`, `succeeded`, `errors`). Formspree receives the data, validates it server-side, and forwards it as an email to **dennis@dlo.wtf**.
- **Form ID:** `xykddnzg` (already registered — see reference example below).
- **Setup:** Install `@formspree/react` via `npm install @formspree/react`.
- **Pros:** Official React library with built-in state management, error handling, and `<ValidationError>` component. Built-in spam protection (honeypot + reCAPTCHA). Simple integration.
- **Cons:** 50 submissions/month on free tier.

#### Reference Example

The file `formspree-example-contact-form.tsx` in the project root contains a working Formspree React example. Use this as the foundation for the `ContactForm` component:

```tsx
// From formspree-example-contact-form.tsx
import { useForm, ValidationError } from "@formspree/react";

function ContactForm() {
  const [state, handleSubmit] = useForm("xykddnzg");
  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" name="email" />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <textarea id="message" name="message" />
      <ValidationError prefix="Message" field="message" errors={state.errors} />
      <button type="submit" disabled={state.submitting}>Submit</button>
    </form>
  );
}
```

**What to keep from the example:**
- `useForm("xykddnzg")` — the hook and form ID
- `state.succeeded` — for showing the success message
- `state.submitting` — for disabling the submit button during submission
- `state.errors` — for server-side validation errors
- `<ValidationError>` — for displaying per-field server-side errors from Formspree

**What to extend:**
- Add the 5 required fields (first name, last name, mobile, email, message) instead of just email + message
- Add client-side validation _before_ submission (the example has no client-side validation)
- Add proper `<label>` elements, accessibility attributes, and themed styling
- Add a back link, page heading, and success/error states
- Add a honeypot field (`_gotcha`) for spam protection

### New Dependency

```bash
npm install @formspree/react
```

This must be run before implementation begins (Step 0 in the implementation steps).

---

## Form Fields

| Field         | Input Type | Validation Rules                                                                       |
| ------------- | ---------- | -------------------------------------------------------------------------------------- |
| First Name    | `text`     | Required. Min 1 character, max 50 characters.                                          |
| Last Name     | `text`     | Required. Min 1 character, max 50 characters.                                          |
| Mobile Number | `tel`      | Required. Pattern: digits, spaces, dashes, parens, optional leading `+`. Min 7 digits. |
| Email Address | `email`    | Required. Must match standard email format.                                            |
| Message       | `textarea` | Required. Min 10 characters, max 500 characters.                                       |

---

## Client-Side Validation Strategy

Validation uses a **two-layer approach**:

1. **Client-side validation** — Custom validation logic using React state, run _before_ the form is submitted to Formspree. This gives instant feedback without a network round-trip.
2. **Server-side validation** — Formspree's `<ValidationError>` component displays any server-side errors returned by Formspree after submission (e.g., if the email bounces or spam is detected).

### Validation approach:

1. **On blur:** Validate individual fields when the user tabs away (immediate feedback).
2. **On submit:** Validate all fields before sending. If any field is invalid, show errors and focus the first invalid field.
3. **On change (after first error):** Once a field has been touched and had an error, re-validate on every keystroke so the error clears as soon as the input becomes valid.

### Validation rules (implemented in a `validateField` utility function):

- **First Name / Last Name:** `value.trim().length > 0` and `value.trim().length <= 50`
- **Mobile Number:** Regex `/^\+?[\d\s\-()]{7,15}$/` after stripping whitespace — allows international formats like `+61 400 123 456`, `(02) 1234-5678`, etc.
- **Email:** Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — simple but effective client-side check. The real validation happens server-side (Formspree).
- **Message:** `value.trim().length >= 10` and `value.trim().length <= 500`

### Error display:

- Each field has an associated error `<span>` with `role="alert"` and `aria-live="polite"` for screen readers.
- Errors appear below the input in a red/error color (themed via CSS variables).
- The submit button is always enabled (not disabled when invalid) — disabling buttons is an anti-pattern for accessibility.

---

## Page Architecture

### How Gatsby Pages Work

In Gatsby, any React component exported as default from a file in `src/pages/` automatically becomes a page. The file path maps directly to the URL:

- `src/pages/index.tsx` → `/`
- `src/pages/contact-form.tsx` → `/contact-form`

No routing configuration is needed — Gatsby handles it automatically.

### New Page: `/contact-form`

The new page wraps its content in the existing `<Layout>` component, which provides:

- `<ThemeProvider>` — dark/light theme context
- `<ThemeToggle />` — theme toggle button (top-right)
- `<main>` — semantic main content wrapper
- `<Footer>` — copyright footer with Gatsby link

This ensures the contact form page has the **same look and feel** as the homepage.

```
src/pages/contact-form.tsx
│
└─ <Layout>                    ← same Layout as index.tsx
     ├─ <ThemeToggle />        ← inherited from Layout
     ├─ <main>
     │    └─ <ContactForm />   ← the new form component
     └─ <Footer />             ← inherited from Layout
```

### Navigation Between Pages

- **Homepage → Contact form:** Add a link in the existing `Contact` section on the homepage using Gatsby's `<Link to="/contact-form">`. This enables client-side navigation (no full page reload).
- **Contact form → Homepage:** Add a "Back" link at the top of the contact form page using `<Link to="/">`.

### Head / SEO

The new page exports its own `Head` component (Gatsby Head API) with a page-specific title (`"Contact — DLO"`) and meta description. Favicon and OG tags are shared by reusing the same pattern from the existing `Head` component.

---

## Component Structure

```
src/pages/
├── index.tsx                # Existing — no changes
└── contact-form.tsx         # NEW — the /contact-form page

src/components/Article/
├── Contact.tsx              # MODIFIED — add Gatsby Link to /contact-form
├── Contact.test.tsx         # MODIFIED — test the new link
└── ...

src/components/ContactForm/
├── ContactForm.tsx          # NEW — the form component (state, validation, submission)
├── ContactForm.css          # NEW — form styles (plain CSS, imported globally)
└── ContactForm.test.tsx     # NEW — tests for the form
```

### `src/pages/contact-form.tsx`

```tsx
// New Gatsby page — wraps ContactForm in shared Layout
import Layout from "../components/Layout/Layout";
import ContactForm from "../components/ContactForm/ContactForm";

const ContactFormPage = () => (
  <Layout>
    <ContactForm />
  </Layout>
);

export default ContactFormPage;

// Page-specific Head for SEO (Gatsby Head API)
export const Head = () => (
  <>
    <html lang="en" />
    <title>Contact — DLO</title>
    <meta name="description" content="Send a message to Dennis Lo" />
  </>
);
```

### `src/components/ContactForm/ContactForm.tsx`

```
React.FC component:
├── Formspree: const [state, handleSubmit] = useForm("xykddnzg")
├── Local state: errors (5 fields), touched (5 fields)
├── Handlers:
│   ├── handleChange — update touched state, re-validate if field was previously invalid
│   ├── handleBlur — validate field on blur
│   └── onSubmit — validate all fields client-side first, then call handleSubmit(e) from useForm
├── validateField(name, value) → string | null
├── validateForm() → boolean (validate all, set errors, focus first invalid)
└── Render:
    ├── Back link → <Link to="/">← Back</Link>
    ├── Page heading → <h1>Contact Me</h1>
    ├── if state.succeeded → "Thank you" message with link back to homepage
    ├── <form onSubmit={onSubmit}>
    │   ├── <input name="_gotcha" type="hidden" /> (honeypot)
    │   ├── First Name: <label> + <input> + client error <span> + <ValidationError>
    │   ├── Last Name:  <label> + <input> + client error <span> + <ValidationError>
    │   ├── Mobile:     <label> + <input type="tel"> + client error <span> + <ValidationError>
    │   ├── Email:      <label> + <input type="email"> + client error <span> + <ValidationError>
    │   ├── Message:    <label> + <textarea> + client error <span> + <ValidationError>
    │   └── <button type="submit" disabled={state.submitting}>
    │        {state.submitting ? "Sending..." : "Send Message"}
    │       </button>
    └── Server error fallback → if state.errors, show general error message
```

**Key integration point:** The `onSubmit` handler first runs client-side validation. If valid, it calls Formspree's `handleSubmit(e)`. If invalid, it prevents submission and shows client-side errors. This combines instant feedback with Formspree's server-side handling.

### `src/components/ContactForm/ContactForm.css`

Styles for the form that respect the existing theme system:

- New CSS variables added to `src/styles/theme.css`:
  - `--input-border` (light: `#ccc`, dark: `#555`)
  - `--input-bg` (light: `#fff`, dark: `#1a1a1a`)
  - `--input-focus-border` (light: `#0066a1`, dark: `#77b7d8`) — reuses heading color
  - `--error-color` (light: `#d32f2f`, dark: `#ff6b6b`)
  - `--success-color` (light: `#2e7d32`, dark: `#81c784`)

---

## Accessibility

- All inputs have associated `<label>` elements (not placeholders as labels).
- Error messages use `role="alert"` and `aria-live="polite"`.
- Invalid fields get `aria-invalid="true"` and `aria-describedby` pointing to their error message.
- Focus is moved to the first invalid field on submit.
- The form has a clear heading for screen readers.
- The submit button text changes to "Sending..." during submission (with `aria-busy="true"` on the form).

---

## Spam Protection

- **Honeypot field:** A hidden input field (e.g., `_gotcha` for Formspree) that real users won't fill in but bots will. If filled, the submission is silently rejected.
- **Formspree's built-in protection:** Formspree applies its own anti-spam measures server-side.

---

## Files to Create / Modify

### New files:

1. **`src/pages/contact-form.tsx`** — New Gatsby page at `/contact-form`. Wraps `<ContactForm />` in `<Layout>`. Exports a page-specific `Head` for SEO.
2. **`src/components/ContactForm/ContactForm.tsx`** — Form component with state, validation, and submission logic.
3. **`src/components/ContactForm/ContactForm.css`** — Form styles (plain CSS, imported globally).
4. **`src/components/ContactForm/ContactForm.test.tsx`** — Unit tests for the form.

### Modified files:

5. **`src/components/Article/Contact.tsx`** — Add a Gatsby `<Link to="/contact-form">` so users can navigate to the form from the homepage.
6. **`src/styles/theme.css`** — Add CSS variables for form inputs, errors, and success states.
7. **`src/components/Article/Contact.test.tsx`** — Add test for the new navigation link.

---

## Testing Plan

Using Jest + React Testing Library + `@testing-library/user-event` (all already installed):

### ContactForm.test.tsx (new)

1. **Renders all form fields** — verify all 5 inputs, labels, and the submit button are present.
2. **Renders back link** — verify the "Back" link to `/` is present.
3. **Required field validation** — submit empty form, verify all 5 error messages appear.
4. **Individual field validation:**
   - Invalid email format shows error.
   - Invalid phone format shows error.
   - Message too short shows error.
5. **Valid submission** — fill all fields correctly, submit, verify fetch is called with correct data.
6. **Success state** — after successful submission, verify thank-you message is shown.
7. **Error state** — mock fetch failure, verify error message is shown.
8. **Honeypot** — verify hidden field is present in the form.
9. **Accessibility** — verify `aria-invalid`, `aria-describedby`, and `role="alert"` attributes.

### Contact.test.tsx (updated)

10. **Contact form link** — verify the link to `/contact-form` is rendered in the Contact section.

---

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation. This keeps the main context focused on orchestration while delegating specialized work.

### Available Agents

| Agent | Path | Role | Tools |
|-------|------|------|-------|
| **test-writer** | `.claude/agents/test-writer.md` | Writes unit/integration tests using Jest + React Testing Library | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash |
| **debugger** | `.claude/agents/debugger.md` | Investigates and fixes test failures, TypeScript errors, runtime bugs | Read, Glob, Grep, Bash, Edit |

### Agent Usage Per Implementation Step

#### Step 0 — Install `@formspree/react`
- **Do it yourself** (main agent). Run `npm install @formspree/react`.

#### Step 1 — Theme CSS variables + ContactForm.css
- **Do it yourself** (main agent). These are straightforward CSS additions.

#### Step 2 — Create `ContactForm.tsx`
- **Do it yourself** (main agent). Create `src/components/ContactForm/ContactForm.tsx` using `useForm` and `ValidationError` from `@formspree/react` (form ID: `xykddnzg`), with client-side validation. Reference `formspree-example-contact-form.tsx` for the basic pattern.

#### Step 3 — Create the page + update Contact.tsx
- **Do it yourself** (main agent). Create `src/pages/contact-form.tsx` wrapping `<ContactForm />` in `<Layout>`. Add a Gatsby `<Link to="/contact-form">` in `Contact.tsx`.

#### Step 4 — Code Review (after writing the component)
- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the new contact form page and component for this feature. The form uses @formspree/react (useForm hook, ValidationError component) with form ID xykddnzg. Check: src/pages/contact-form.tsx, src/components/ContactForm/ContactForm.tsx, src/components/ContactForm/ContactForm.css, src/components/Article/Contact.tsx, src/styles/theme.css. Focus on security (XSS in form inputs, safe fetch usage), React best practices (hooks, controlled inputs), accessibility (labels, aria attributes, focus management), CSS theming correctness, correct Gatsby page/Link usage, and proper @formspree/react integration.")
  ```
- Address any Critical or Warning findings before proceeding.

#### Step 5 — Write Tests
- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Write comprehensive tests for the new ContactForm component at src/components/ContactForm/ContactForm.tsx. The component uses @formspree/react (useForm hook, ValidationError component). Create src/components/ContactForm/ContactForm.test.tsx. Also update src/components/Article/Contact.test.tsx to add a test for the new Gatsby Link to /contact-form. Cover: rendering all fields and labels, back link to /, required field validation (empty submit), individual field validation (bad email, bad phone, short message), successful submission (mock @formspree/react useForm), error state (submission failure), honeypot field, aria-invalid/aria-describedby attributes, success message display. Use userEvent for interactions. Mock @formspree/react module (useForm returns [state, handleSubmit]). Mock gatsby Link as needed.")
  ```

#### Step 6 — Run Typecheck + Tests
- Run `npm run typecheck` and `npm test` from the main agent.

#### Step 7 — Debug Failures (if any)
- **Delegate to `debugger`** via the Task tool (only if step 6 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following test/typecheck failures: <paste error output>. The new ContactForm component is at src/components/ContactForm/ContactForm.tsx with tests at src/components/ContactForm/ContactForm.test.tsx. The new page is at src/pages/contact-form.tsx.")
  ```
- Re-run typecheck + tests after fixes.

#### Step 8 — Final Code Review
- **Delegate to `code-reviewer`** for a final pass after all fixes are applied:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete contact form feature. Check all new/modified files: src/pages/contact-form.tsx, src/components/ContactForm/ContactForm.tsx, src/components/ContactForm/ContactForm.css, src/components/ContactForm/ContactForm.test.tsx, src/components/Article/Contact.tsx, src/components/Article/Contact.test.tsx, src/styles/theme.css. Verify test coverage is adequate, no security issues remain, and the implementation matches the plan in CONTACT_FORM_PLAN.md.")
  ```

#### Step 9 — Manual Testing
- Run `npm run develop` and test the form in the browser at `http://localhost:8000/contact-form`.

### Parallelization Opportunities

- Steps 4 (code review) and 5 (test writing) can be launched **in parallel** since the code-reviewer is read-only and the test-writer writes to a separate file.
- If the debugger fixes code in step 7, re-run both code-reviewer and test suite afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ npm install @formspree/react (Step 0)
│
├─ Writes code (Steps 1-3)
│   ├─ theme.css variables + ContactForm.css
│   ├─ ContactForm.tsx (using useForm + ValidationError from @formspree/react)
│   ├─ contact-form.tsx page
│   └─ Contact.tsx link update
│
├─ Delegates in parallel:
│   ├─ code-reviewer → reviews code (Step 4)
│   └─ test-writer → writes tests (Step 5)
│
├─ Runs typecheck + tests (Step 6)
│
├─ If failures → debugger (Step 7) → re-run Step 6
│
├─ Final code-reviewer pass (Step 8)
│
└─ Manual testing at /contact-form (Step 9)
```

---

## Implementation Steps (Summary)

0. **Install dependency:** `npm install @formspree/react`
1. Add new CSS variables to `src/styles/theme.css` for form theming.
2. Create `src/components/ContactForm/ContactForm.tsx` and `ContactForm.css` — form component using `useForm` from `@formspree/react`, with client-side validation and styles.
3. Create `src/pages/contact-form.tsx` — new Gatsby page wrapping `<ContactForm />` in `<Layout>`. Update `src/components/Article/Contact.tsx` to add a Gatsby `<Link>` to `/contact-form`.
4. **Agent: code-reviewer** — Review all new/modified files.
5. **Agent: test-writer** — Write `ContactForm.test.tsx` and update `Contact.test.tsx`. _(Run in parallel with step 4.)_
6. Run `npm run typecheck` and `npm test`.
7. **Agent: debugger** — Fix any failures from step 6. _(Only if needed.)_
8. **Agent: code-reviewer** — Final review pass.
9. Manual testing at `http://localhost:8000/contact-form`.
