# Component Template Guide

## Component Structure

### 1. File Organization
```
components/
├── ui/             # Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── features/       # Feature-specific components
│   ├── auth/
│   ├── solutions/
│   └── ...
└── layouts/        # Layout components
    ├── header/
    ├── footer/
    └── ...
```

### 2. Component File Structure
```typescript
// Import statements
import * as React from 'react'
import { cn } from '@/lib/utils'

// Types/Interfaces
interface ComponentProps {
  // Props definition
}

// Variants (if using class-variance-authority)
const componentVariants = cva(
  // Base styles
  {
    variants: {
      // Variant definitions
    },
    defaultVariants: {
      // Default variant values
    }
  }
)

// Component definition
const Component = React.forwardRef<HTMLElement, ComponentProps>((
  { prop1, prop2, className, ...props },
  ref
) => {
  return (
    // JSX implementation
  )
})

// Display name
Component.displayName = 'Component'

// Exports
export { Component, componentVariants }
```

## Documentation Requirements

### 1. Component Documentation
Each component should include:
- Purpose and usage description
- Props documentation
- Examples of different variants/states
- Accessibility considerations
- Related components or dependencies

### 2. Storybook Stories
```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'UI/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Argument type definitions
  }
}

export default meta
type Story = StoryObj<typeof ComponentName>

// Story examples
export const Default: Story = {
  args: {
    // Default props
  }
}
```

## Testing Standards

### 1. Unit Tests
```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    // Assertions
  })

  it('handles interactions correctly', () => {
    // Interaction tests
  })

  it('applies variants correctly', () => {
    // Variant tests
  })
})
```

### 2. Integration Tests
- Test component interactions
- Test component with context/providers
- Test component with real data flows

## Best Practices

### 1. Naming Conventions
- Use PascalCase for component names
- Use camelCase for props and functions
- Use kebab-case for CSS classes
- Prefix internal functions with underscore

### 2. Props Guidelines
- Use interface for props definition
- Document required vs optional props
- Use proper TypeScript types
- Implement prop validation

### 3. Styling Guidelines
- Use Tailwind CSS for styling
- Follow utility-first approach
- Use class-variance-authority for variants
- Maintain consistent spacing/sizing

### 4. Performance Considerations
- Implement proper memoization
- Avoid unnecessary re-renders
- Optimize event handlers
- Use proper React hooks

### 5. Accessibility
- Include proper ARIA attributes
- Ensure keyboard navigation
- Support screen readers
- Follow WCAG guidelines

## Component Checklist
- [ ] Component implements proper TypeScript types
- [ ] Component includes comprehensive tests
- [ ] Component has Storybook stories
- [ ] Component follows accessibility guidelines
- [ ] Component is properly documented
- [ ] Component follows naming conventions
- [ ] Component implements proper error handling
- [ ] Component has necessary variants/states