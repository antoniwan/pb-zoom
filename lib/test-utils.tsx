import type React from "react"
import { render as rtlRender } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SessionProvider } from "next-auth/react"

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Create a custom render function that includes providers
function render(ui: React.ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
      ...options,
    }),
  }
}

// Re-export everything
export * from "@testing-library/react"

// Override render method
export { render }

