# Jest Unit Testing Best Practices

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Template Tests](#template-tests)
- [Common Patterns](#common-patterns)
- [Mocking](#mocking)
- [Coverage](#coverage)

## Overview

This project uses Jest with React Testing Library for unit testing. Tests are written in TypeScript and colocated with the components they test.

## Configuration

### Configuration Files

- [jest.config.js](../../jest.config.js) - Jest configuration
- [jest.setup.js](../../jest.setup.js) - Jest setup and global test configuration

## Test Structure

### File Naming

- Place test files adjacent to the code they test
- Use `.test.tsx` or `.test.ts` extension
- Example: `Component.tsx` → `Component.test.tsx`

### Test Organization

```typescript
describe("ComponentName", () => {
  // Group related tests
  describe("rendering", () => {
    it("should render without crashing", () => {
      // Test implementation
    });
  });

  describe("user interactions", () => {
    it("should handle click events", () => {
      // Test implementation
    });
  });
});
```

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// ✅ Good
it("renders error message when form validation fails", () => {});

// ❌ Bad
it("test 1", () => {});
```

### 2. Follow AAA Pattern (Arrange-Act-Assert)

```typescript
it("updates counter when button is clicked", () => {
  // Arrange
  render(<Counter initialCount={0} />);

  // Act
  const button = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(button);

  // Assert
  expect(screen.getByText("1")).toBeInTheDocument();
});
```

### 3. Test User Behavior, Not Implementation

```typescript
// ✅ Good - tests what the user sees
it("displays error message for invalid email", () => {
  render(<LoginForm />);
  const emailInput = screen.getByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: "invalid" } });
  fireEvent.blur(emailInput);
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});

// ❌ Bad - tests internal state
it("sets error state to true", () => {
  const { container } = render(<LoginForm />);
  // Don't test component internal state
});
```

### 4. Use Queries in Order of Priority

1. `getByRole` - Accessible to everyone
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Forms without labels
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

### 5. Avoid Testing Implementation Details

```typescript
// ✅ Good
expect(screen.getByRole("button")).toBeDisabled();

// ❌ Bad
expect(component.state.isDisabled).toBe(true);
```

## Template Tests

### Basic React Component Test

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders without crashing", () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container).toBeTruthy();
  });

  it("displays the correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("is accessible", () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Component with Props Test

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders with success variant", () => {
    render(<Alert variant="success">Success message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert-success");
  });

  it("renders with error variant", () => {
    render(<Alert variant="error">Error message</Alert>);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <Alert className="custom-class">Message</Alert>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
```

### User Interaction Test

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("increments counter on button click", () => {
    render(<Counter initialCount={0} />);
    const button = screen.getByRole("button", { name: /increment/i });

    fireEvent.click(button);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles multiple clicks", async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);
    const button = screen.getByRole("button", { name: /increment/i });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
```

### Async/Await Test

```typescript
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  it("loads and displays user data", async () => {
    render(<UserProfile userId="123" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    // Mock API to return error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });
  });
});
```

### Form Submission Test

```typescript
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits form with valid credentials", async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });
  });

  it("displays validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

## Common Patterns

### Testing with Mocked Components

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import Article from "./Article";

// Mock child components
jest.mock("./Header", () => () => <div data-testid="header">Header</div>);
jest.mock("./Footer", () => () => <div data-testid="footer">Footer</div>);

describe("Article", () => {
  it("renders with mocked child components", () => {
    render(<Article />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
```

### Testing Links and Navigation

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { Navigation } from "./Navigation";

describe("Navigation", () => {
  it("renders navigation links with correct hrefs", () => {
    render(<Navigation />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).toHaveAttribute("href", "/about");
  });
});
```

### Testing Conditional Rendering

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { Message } from "./Message";

describe("Message", () => {
  it("renders message when isVisible is true", () => {
    render(<Message isVisible={true} text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("does not render message when isVisible is false", () => {
    render(<Message isVisible={false} text="Hello" />);
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});
```

## Mocking

### Mocking Modules

```typescript
// Mock entire module
jest.mock("./api", () => ({
  fetchUser: jest.fn(() => Promise.resolve({ name: "John" })),
}));

// Mock specific exports
jest.mock("./utils", () => ({
  ...jest.requireActual("./utils"),
  formatDate: jest.fn(() => "2024-01-01"),
}));
```

### Mocking Functions

```typescript
const mockCallback = jest.fn();

it("calls callback with correct arguments", () => {
  render(<Button onClick={mockCallback}>Click</Button>);
  fireEvent.click(screen.getByRole("button"));

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(expect.any(Object));
});
```

### Mocking API Calls

```typescript
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: "mocked data" }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("fetches data successfully", async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText("mocked data")).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledWith("/api/data");
});
```

## Coverage

### Running Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Run coverage for specific files
npm test -- --coverage --collectCoverageFrom="src/components/**/*.{ts,tsx}"
```

### Coverage Thresholds

Add to `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

## Quick Reference

### Common Matchers

```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent("text");
expect(element).toHaveClass("class-name");
expect(element).toHaveAttribute("href", "/path");
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toBeVisible();
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

### Useful Testing Library Queries

```typescript
// By Role (Preferred)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });

// By Label
screen.getByLabelText(/email address/i);

// By Text
screen.getByText(/welcome/i);

// By Test ID (Last Resort)
screen.getByTestId("custom-element");

// Query variants
screen.queryBy*() // Returns null if not found
screen.findBy*()  // Returns promise (for async)
screen.getAllBy*() // Returns array
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
