# Design Tokens: SpringSports Public Site

## Philosophy

These tokens are derived from the SpringSports public-site brief: a boutique professional scouting platform with restrained sports energy. The system should feel calm and credible first, with orange used as an action and basketball-energy accent rather than as a decorative wash.

The current app already uses Tailwind, shadcn CSS variables, Geist fonts, and dark-first tokens in `app/src/styles/globals.css`. These tokens extend that system rather than replacing it.

## Implementation Strategy

- Keep shadcn semantic HSL tokens (`--background`, `--foreground`, `--card`, `--primary`, etc.) because existing components depend on them.
- Consolidate brand/system tokens under semantic `--color-*`, `--space-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--duration-*`, and `--ease-*` names.
- Dark mode remains the primary production experience.
- Light mode tokens are defined for completeness and future system preference support, but the current UI can continue rendering dark by default.
- Component code should prefer Tailwind semantic classes (`bg-background`, `text-muted-foreground`, `border-border`, `bg-orange-500`) or CSS variables from this document instead of hard-coded one-off values.

## Color Tokens

### Dark Mode: Current Primary Theme

```css
:root,
[data-theme="dark"] {
  /* shadcn compatibility */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 24 98% 44%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 24 98% 44%;

  /* semantic surfaces */
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #111118;
  --color-bg-tertiary: #1a1a24;
  --color-bg-inverse: #f8fafc;
  --color-surface-primary: #16161f;
  --color-surface-secondary: #1e1e2a;
  --color-surface-elevated: #242433;
  --color-surface-overlay: rgba(0, 0, 0, 0.68);

  /* text */
  --color-text-primary: #f8f8f8;
  --color-text-secondary: #b4b4c8;
  --color-text-tertiary: #7070a0;
  --color-text-disabled: #4a4a6a;
  --color-text-inverse: #101014;
  --color-text-link: #fb923c;

  /* borders */
  --color-border-primary: rgba(255, 255, 255, 0.08);
  --color-border-secondary: rgba(255, 255, 255, 0.15);
  --color-border-focus: #f97316;

  /* accent */
  --color-accent-primary: #f97316;
  --color-accent-primary-hover: #ea580c;
  --color-accent-primary-active: #c2410c;
  --color-accent-secondary: #fed7aa;
  --color-accent-glow: rgba(249, 115, 22, 0.25);

  /* status */
  --color-status-success: #22d3a0;
  --color-status-warning: #facc15;
  --color-status-error: #ef4444;
  --color-status-info: #3b82f6;
}
```

### Light Mode: Future Support

```css
[data-theme="light"] {
  /* shadcn compatibility */
  --background: 0 0% 100%;
  --foreground: 240 10% 8%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 8%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 8%;
  --primary: 24 94% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 5% 96%;
  --secondary-foreground: 240 10% 8%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 42%;
  --accent: 24 95% 95%;
  --accent-foreground: 24 94% 28%;
  --destructive: 0 72% 45%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 24 94% 50%;

  /* semantic surfaces */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-bg-inverse: #0a0a0f;
  --color-surface-primary: #ffffff;
  --color-surface-secondary: #f8fafc;
  --color-surface-elevated: #ffffff;
  --color-surface-overlay: rgba(15, 23, 42, 0.48);

  /* text */
  --color-text-primary: #111118;
  --color-text-secondary: #475569;
  --color-text-tertiary: #64748b;
  --color-text-disabled: #94a3b8;
  --color-text-inverse: #f8fafc;
  --color-text-link: #ea580c;

  /* borders */
  --color-border-primary: rgba(15, 23, 42, 0.1);
  --color-border-secondary: rgba(15, 23, 42, 0.18);
  --color-border-focus: #f97316;

  /* accent */
  --color-accent-primary: #f97316;
  --color-accent-primary-hover: #ea580c;
  --color-accent-primary-active: #c2410c;
  --color-accent-secondary: #ffedd5;
  --color-accent-glow: rgba(249, 115, 22, 0.18);

  /* status */
  --color-status-success: #059669;
  --color-status-warning: #ca8a04;
  --color-status-error: #dc2626;
  --color-status-info: #2563eb;
}
```

### System Preference Hook

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    color-scheme: light;
  }
}
```

## Spacing Tokens

The existing app already uses a practical 4px/8px hybrid. Keep it and fill missing intermediate steps for consistency.

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-7: 2rem;     /* 32px */
  --space-8: 2.5rem;   /* 40px */
  --space-9: 3rem;     /* 48px */
  --space-10: 4rem;    /* 64px */
  --space-11: 5rem;    /* 80px */
  --space-12: 6rem;    /* 96px */
}
```

## Typography Tokens

```css
:root {
  --font-family-display: var(--font-geist-sans, system-ui, sans-serif);
  --font-family-body: var(--font-geist-sans, system-ui, sans-serif);
  --font-family-mono: var(--font-geist-mono, ui-monospace, monospace);

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-md: 1.125rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 1.875rem;
  --font-size-3xl: 2.25rem;
  --font-size-4xl: 3rem;
  --font-size-5xl: 3.75rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  --line-height-tight: 1.15;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.65;

  --letter-spacing-tight: 0;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.08em;
  --letter-spacing-label: 0.18em;
}
```

## Layout Tokens

```css
:root {
  --max-width-content: 72ch;
  --max-width-wide: 72rem;
  --max-width-page: 80rem;
  --container-padding: var(--space-6);
  --header-height: 64px;

  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.625rem;
  --border-radius-xl: 0.75rem;
  --border-radius-full: 9999px;

  /* shadcn compatibility */
  --radius: 0.5rem;
  --radius-sm: var(--border-radius-sm);
  --radius-md: var(--border-radius-md);
  --radius-lg: var(--border-radius-lg);
  --radius-xl: var(--border-radius-xl);
  --radius-full: var(--border-radius-full);
}
```

## Shadow Tokens

```css
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.32);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.42);
  --shadow-focus: 0 0 0 3px rgba(249, 115, 22, 0.28);
  --shadow-brand: 0 0 32px rgba(249, 115, 22, 0.2);
}

[data-theme="light"] {
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.1);
  --shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.14);
  --shadow-focus: 0 0 0 3px rgba(249, 115, 22, 0.24);
  --shadow-brand: 0 0 28px rgba(249, 115, 22, 0.16);
}
```

## Motion Tokens

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Responsive Breakpoints

These mirror Tailwind defaults plus the existing `2xl` container behavior.

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Component-Level Tokens

```css
:root {
  --component-card-bg: var(--color-surface-primary);
  --component-card-border: var(--color-border-primary);
  --component-card-radius: var(--border-radius-lg);
  --component-card-padding: var(--space-6);

  --component-button-primary-bg: var(--color-accent-primary);
  --component-button-primary-bg-hover: var(--color-accent-primary-hover);
  --component-button-primary-text: #ffffff;
  --component-button-radius: var(--border-radius-lg);
  --component-button-height-sm: 2rem;
  --component-button-height-md: 2.5rem;

  --component-input-bg: var(--color-bg-primary);
  --component-input-border: var(--color-border-primary);
  --component-input-border-focus: var(--color-border-focus);
  --component-input-radius: var(--border-radius-md);

  --component-header-bg: rgba(10, 10, 15, 0.85);
  --component-header-border: var(--color-border-primary);
  --component-header-height: var(--header-height);
}
```

## Current Code Gaps

- `globals.css` is dark-first and does not yet include a complete light-mode token block.
- `globals.css` duplicates some ideas under both shadcn names and custom `--color-*` names; consolidate over time rather than in a single risky rewrite.
- The current spacing scale skips `--space-7`, `--space-9`, and `--space-11`; add them when refactoring the token block.
- Header and admin module CSS still use module-local styling; keep them, but gradually point repeated values back to global tokens.
- Letter spacing should remain non-negative. Use `0` for normal text and only positive values for uppercase labels.

## Tailwind Mapping

Existing Tailwind mappings should remain:

```ts
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
}
```

Future Tailwind extension can add named SpringSports tokens only after consolidating `globals.css`.
