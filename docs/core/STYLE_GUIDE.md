# AIXchange Style Guide

## Theme System

### Colors

We use RGB values for our color system to support opacity modifications. Colors are defined as CSS custom properties in the root and dark themes.

```css
:root {
  --background: 246 247 251;    /* Light background */
  --foreground: 15 23 42;       /* Light text */
  --primary: 79 70 229;         /* Primary purple */
  --secondary: 99 102 241;      /* Secondary indigo */
}

.dark {
  --background: 15 23 42;       /* Dark background */
  --foreground: 255 255 255;    /* Dark text */
  /* ... */
}
```

### Usage

#### Basic Colors
```tsx
<div className="bg-background text-foreground">
  <p className="text-primary">Colored text</p>
</div>
```

#### Opacity Modifiers
```tsx
<div className="bg-primary/10">  /* 10% opacity */
<p className="text-primary/80">  /* 80% opacity */
```

### Components

#### Buttons

We provide three button variants:

1. Primary Button
```tsx
<button className="btn-primary">
  Click me
</button>
```

2. Secondary Button
```tsx
<button className="btn-secondary">
  Click me
</button>
```

3. Outline Button
```tsx
<button className="btn-outline">
  Click me
</button>
```

#### Cards

Cards use the theme's card background and border colors:

```tsx
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-card-foreground">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>
```

Add hover effects with the card-hover class:
```tsx
<div className="bg-card border border-border rounded-lg p-4 card-hover">
```

### Gradients

#### Background Gradients
```tsx
<div className="bg-gradient-primary">
  Gradient background
</div>
```

#### Text Gradients
```tsx
<h1 className="text-gradient-primary">
  Gradient text
</h1>
```

### Theme Toggle

The theme toggle component is available in the Navbar:

```tsx
import { useTheme } from "@/components/theme/ThemeProvider";

function Component() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-muted transition-colors"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

## Layout

### Container
Use the container class for consistent page width:
```tsx
<div className="container mx-auto px-4">
```

### Spacing
- Use margin and padding utilities from Tailwind
- Prefer rem units (provided by Tailwind)
- Common section spacing: `py-20`

### Responsive Design
- Use Tailwind's responsive prefixes
- Mobile-first approach
- Common breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

## Typography

### Font Sizes
- Headings: `text-4xl` to `text-6xl`
- Body: `text-base`
- Small text: `text-sm`

### Font Weights
- Regular: `font-normal`
- Medium: `font-medium`
- Bold: `font-bold`

### Text Colors
- Primary text: `text-foreground`
- Secondary text: `text-muted-foreground`
- Links: `text-primary`

## Best Practices

1. Always use theme colors instead of hardcoded values
2. Use semantic color names (e.g., `primary` not `purple`)
3. Implement smooth transitions for theme changes
4. Test components in both light and dark modes
5. Use opacity modifiers for subtle variations
6. Follow mobile-first responsive design
7. Maintain consistent spacing patterns

## Accessibility

1. Ensure sufficient color contrast
2. Provide hover and focus states
3. Use semantic HTML elements
4. Include ARIA labels where needed
5. Test with keyboard navigation
6. Verify color-blind friendly combinations

## Tools

- Tailwind CSS: Utility classes
- CSS Variables: Theme values
- React Context: Theme state
- localStorage: Theme persistence