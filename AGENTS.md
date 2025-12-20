# AGENTS.md
# Story
    - This is a CRM app build with Next.js both in frontEnd and backEnd.
    - The database is locally a postgres you can find creds at .env
    - Goal is to create a CRM to handle customers CRUD & create an api to send sms through SMSAPI
    - For remembering the history of each customer we should create a table of actions to write every sms or every type of action we did with customer.


## Build/Lint/Test Commands
- Development: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Start: `npm run start`

## Code Style Guidelines

### Imports
- Use absolute imports with `@/` prefix for src directory
- Place third-party imports before local imports
- Group related imports together

### Formatting
- Use consistent indentation (2 spaces)
- No trailing whitespace
- Line endings: LF (Unix style)
- Max line length: 100 characters

### Types
- Use JavaScript with JSDoc for type annotations
- Prefer explicit types over implicit ones
- Validate function parameters and API responses

### Naming Conventions
- Variables: camelCase
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: camelCase.js or PascalCase.js for components

### Error Handling
- Always handle errors in try/catch blocks
- Log errors with descriptive messages
- Return appropriate HTTP status codes (400, 401, 403, 500)
- Don't expose internal error details to clients

### Component Structure
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use MUI components when available
- Implement proper loading states
- Handle edge cases (empty states, errors)

### API Routes
- Validate session and permissions
- Validate request parameters
- Use structured response format: `{ success: boolean, data?: any, message?: string }`
- Always release database connections