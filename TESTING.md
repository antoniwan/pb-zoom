# Testing Documentation

This project uses Jest and React Testing Library for testing. This document outlines the testing setup, conventions, and best practices.

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: Simulating user interactions
- **jest-environment-jsdom**: DOM environment for tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

## Test File Structure

- Test files should be co-located with the component/module they test
- Use the `.test.tsx` or `.test.ts` extension
- Example: `components/MyComponent.tsx` → `components/MyComponent.test.tsx`

## Coverage Requirements

The project has the following coverage thresholds:

```typescript
{
  branches: 80%,
  functions: 80%,
  lines: 80%,
  statements: 80%
}
```

## Writing Tests

### Component Tests

1. Import required utilities:
```typescript
import { render, screen } from '@/lib/test-utils'
```

2. Basic test structure:
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Common Mocks

The project includes several pre-configured mocks:

1. **Next.js Image**:
```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}))
```

2. **Next.js Link**:
```typescript
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => (
    <a href={href}>{children}</a>
  ),
}))
```

3. **Next.js Router**:
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '',
}))
```

4. **NextAuth**:
```typescript
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))
```

### Testing Utilities

The project provides a custom `render` function in `lib/test-utils.tsx` that includes common providers:

```typescript
import { render } from '@/lib/test-utils'

// This render function includes:
// - SessionProvider
// - Additional providers can be added as needed
```

### Best Practices

1. **User-centric Testing**:
   - Test from the user's perspective
   - Use semantic queries (getByRole, getByText) over test IDs
   - Example:
   ```typescript
   // Good
   screen.getByRole('button', { name: /submit/i })
   
   // Avoid
   screen.getByTestId('submit-button')
   ```

2. **Async Testing**:
   ```typescript
   it('should handle async operations', async () => {
     render(<MyComponent />)
     await screen.findByText('loaded content')
   })
   ```

3. **User Interactions**:
   ```typescript
   it('should handle user interactions', async () => {
     const handleClick = jest.fn()
     render(<Button onClick={handleClick}>Click me</Button>)
     
     screen.getByRole('button').click()
     expect(handleClick).toHaveBeenCalled()
   })
   ```

4. **Mocking API Calls**:
   ```typescript
   jest.mock('@/lib/api', () => ({
     fetchData: jest.fn().mockResolvedValue({ data: 'mocked' })
   }))
   ```

### Example Test

Here's a complete example of a component test:

```typescript
import { render, screen } from '@/lib/test-utils'
import { ProfileCard } from './profile-card'

describe('ProfileCard', () => {
  const mockProfile = {
    _id: '123',
    title: 'Test Profile',
    // ... other required props
  }

  it('renders profile information correctly', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    )

    expect(screen.getByText('Test Profile')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn()
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={handleDelete}
        onToggleVisibility={() => {}}
      />
    )

    screen.getByRole('button', { name: /delete/i }).click()
    expect(handleDelete).toHaveBeenCalledWith(mockProfile._id)
  })
})
```

## Debugging Tests

1. Use `console.log` or `debug()` to inspect the rendered output:
```typescript
const { debug } = render(<MyComponent />)
debug()
```

2. Use `.only` to run specific tests:
```typescript
it.only('should test this specific case', () => {
  // This test will run exclusively
})
```

3. Use `.skip` to skip tests:
```typescript
it.skip('should skip this test', () => {
  // This test will be skipped
})
```

## Common Issues and Solutions

1. **Styling-related Tests**:
   - Don't test implementation details of styles
   - Test visual states through accessible attributes

2. **Async Operations**:
   - Use `findBy*` queries for elements that appear after async operations
   - Use `waitFor` for other async assertions

3. **Event Handling**:
   - Use `userEvent` over `fireEvent` for more realistic user interactions
   - Remember to await async user events

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Library Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 