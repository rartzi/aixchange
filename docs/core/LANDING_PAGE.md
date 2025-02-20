# Landing Page Technical Documentation

## Technology Stack

### Core Technologies
- **Next.js 14** with App Router for server-side rendering and routing
- **React** with "use client" directive for client-side interactivity
- **TypeScript** for type safety and improved developer experience
- **Tailwind CSS** for utility-first styling and responsive design

### Key Dependencies
- next: ^14.0.0
- react: ^18.0.0
- typescript: ^5.0.0
- tailwindcss: ^3.0.0

## Architecture Overview

### 1. Theme System Implementation
The theme system uses React Context for global state management:

```typescript
// ThemeProvider.tsx
- Manages dark/light mode state
- Persists theme preference in localStorage
- Detects system color scheme preference
- Provides theme toggle functionality
- Applies theme classes to root element
```

Theme switching is handled automatically through CSS classes and variables:
```css
/* Tailwind theme configuration */
:root {
  --primary: ...; /* Light mode variables */
}

.dark {
  --primary: ...; /* Dark mode variables */
}
```

### 2. Navigation System
The Navbar component (`app/src/components/layout/Navbar.tsx`) provides:
- Consistent navigation across all pages
- Theme toggle button
- Responsive design with mobile considerations
- Dynamic link highlighting
- Smooth theme transitions

### 3. Page Structure

#### Hero Section
```typescript
<section className="container mx-auto px-4 py-20 flex items-center justify-between">
  - Two-column layout
  - Optimized image loading with Next.js Image
  - Responsive text sizing
  - Call-to-action buttons
</section>
```

#### How it Works Section
```typescript
<section className="py-20 bg-muted/50">
  - Three-column grid layout
  - Numbered step indicators
  - Responsive collapse to single column
  - Consistent spacing system
</section>
```

#### Features Section
```typescript
<section className="py-20">
  - Card-based layout with hover effects
  - SVG icons with theme-aware colors
  - Consistent card sizing and spacing
  - Responsive grid system
</section>
```

#### Stats Section
```typescript
<section className="py-20 bg-gradient-primary">
  - Four-column statistics display
  - Theme-aware gradient background
  - Responsive number formatting
  - Automatic mobile stacking
</section>
```

## Color System

### Base Colors
```typescript
// Tailwind configuration
colors: {
  primary: {...}, // Brand primary color
  muted: {...},   // Subtle backgrounds
  card: {...},    // Card backgrounds
  border: {...},  // Border colors
}
```

### Theme-Aware Classes
- `text-foreground`: Main text color
- `text-muted-foreground`: Secondary text
- `bg-card`: Card backgrounds
- `border-border`: Border colors
- `bg-primary/10`: Semi-transparent backgrounds

## Responsive Design

### Breakpoint System
```typescript
// Tailwind breakpoints
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
}
```

### Mobile-First Approach
- Default styles target mobile devices
- Progressive enhancement with breakpoint prefixes
- Fluid typography scaling
- Responsive spacing units

## Implementation Guide for New Pages

### 1. Basic Page Structure
```typescript
"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export default function NewPage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        {/* Page content */}
      </section>
    </div>
  );
}
```

### 2. Theme Integration
```typescript
// Access theme context
const { theme, toggleTheme } = useTheme();

// Use theme-aware classes
<div className="bg-card text-foreground">
  <p className="text-muted-foreground">
    Theme-aware content
  </p>
</div>
```

### 3. Responsive Patterns
```typescript
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Grid items */}
</div>

// Flexbox layouts
<div className="flex flex-col md:flex-row gap-4">
  {/* Flex items */}
</div>
```

## Best Practices

### 1. Performance Optimization
- Use Next.js Image component for optimized images
- Implement proper loading states
- Minimize client-side JavaScript
- Utilize proper component splitting

### 2. Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast

### 3. Code Organization
- Component-based architecture
- Consistent naming conventions
- Clear section comments
- Type safety enforcement

### 4. Theme Consistency
- Use provided color variables
- Follow spacing system
- Maintain responsive patterns
- Use shared components

## Maintaining Consistency

### 1. Layout Structure
- Use the root layout for common elements
- Maintain consistent container widths
- Follow established spacing patterns
- Implement shared navigation

### 2. Component Reuse
- Utilize shared UI components
- Follow established patterns
- Maintain consistent styling
- Use common utilities

### 3. Theme Integration
- Always use theme-aware classes
- Test in both light and dark modes
- Follow color hierarchy
- Maintain contrast ratios

## Common Patterns

### 1. Section Layout
```typescript
<section className="py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">
      Section Title
    </h2>
    {/* Section content */}
  </div>
</section>
```

### 2. Card Components
```typescript
<div className="p-8 rounded-xl bg-card border border-border card-hover">
  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
    {/* Icon */}
  </div>
  <h3 className="text-xl font-bold text-card-foreground mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card content
  </p>
</div>
```

### 3. Button Styles
```typescript
<button className="btn-primary text-lg">
  Primary Action
</button>

<button className="btn-secondary text-lg">
  Secondary Action
</button>
```

## Testing Considerations

### 1. Theme Testing
- Test components in both themes
- Verify color contrast
- Check transition animations
- Validate responsive behavior

### 2. Responsive Testing
- Test all breakpoints
- Verify mobile navigation
- Check touch interactions
- Validate image scaling

### 3. Performance Testing
- Monitor load times
- Check image optimization
- Verify smooth transitions
- Test navigation performance

## Future Considerations

### 1. Scalability
- Component modularity
- Theme extensibility
- Performance optimization
- Accessibility improvements

### 2. Maintenance
- Regular dependency updates
- Performance monitoring
- Accessibility audits
- Documentation updates

This documentation provides a comprehensive guide for maintaining and extending the landing page implementation while ensuring consistency across the platform.