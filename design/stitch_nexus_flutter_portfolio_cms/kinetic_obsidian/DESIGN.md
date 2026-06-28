---
name: Kinetic Obsidian
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#393939'
  surface-container-lowest: '#0d0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e4e2e2'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e4e2e2'
  inverse-on-surface: '#303031'
  outline: '#8b90a0'
  outline-variant: '#414754'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#0070f3'
  on-primary-container: '#ffffff'
  inverse-primary: '#0059c5'
  secondary: '#c6c6cc'
  on-secondary: '#2f3035'
  secondary-container: '#47494e'
  on-secondary-container: '#b7b8be'
  tertiary: '#48ddbc'
  on-tertiary: '#00382d'
  tertiary-container: '#00866f'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#e2e2e8'
  secondary-fixed-dim: '#c6c6cc'
  on-secondary-fixed: '#1a1c20'
  on-secondary-fixed-variant: '#45474b'
  tertiary-fixed: '#6bfad8'
  tertiary-fixed-dim: '#48ddbc'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005142'
  background: '#131314'
  on-background: '#e4e2e2'
  surface-variant: '#343535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  max-width-content: 1200px
  sidebar-width: 280px
---

## Brand & Style

This design system embodies a "Developer-First Luxury" aesthetic. It merges the high-performance utility of developer tools with the refined elegance of a premium lifestyle brand. The narrative is centered on clarity, speed, and technical mastery.

**Style Direction: Minimalist Glassmorphism**
The visual language uses a deep, monochromatic foundation punctuated by high-frequency "Electric Blue" accents. The interface relies on structural hierarchy rather than decorative elements. Key characteristics include:
- **Depth through Translucency:** Utilizing glassmorphism for navigation and headers to maintain context while scrolling.
- **Precision Engineering:** Monospaced accents and microscopic details (like 1px borders) signal technical rigor.
- **Sophisticated Motion:** Interactions should feel snappy yet dampened, mimicking the feel of high-end mechanical hardware.
- **Functional Sophistication:** Heavy use of whitespace to separate complex technical data, ensuring the content remains the hero.

## Colors

The palette is anchored in a "Deep Space" navy-black to provide maximum contrast for technical content. 

- **Primary (Electric Blue):** Reserved for primary actions, progress indicators, and focal points. It represents energy and connectivity.
- **Secondary (Obsidian):** The primary surface color for containers and sidebars.
- **Tertiary (Cyan Accent):** Used sparingly in gradients with the primary blue to provide a sense of "glow" and modernity.
- **Neutral Stack:** A range of grays from `#F0F2F5` (light mode text/surfaces) to `#666666` (meta-information) ensures legible hierarchy.

**Gradient Logic:** 
- Surfaces: `linear-gradient(180deg, #0A0C10 0%, #050505 100%)`
- Accents: `linear-gradient(90deg, #0070F3 0%, #50E3C2 100%)`

## Typography

Typography is used as a structural element. **Geist** provides a modern, geometric look for headings that feels engineered. **Inter** is the workhorse for body copy, chosen for its exceptional readability in both light and dark modes.

**JetBrains Mono** is utilized for "Technical Metadata"—tags, IDs, timestamps, and actual code snippets. This font choice signals to the user that they are viewing functional, data-driven information.

**Hierarchy Rules:**
- Use **Display-LG** for hero statements with tight letter-spacing.
- **Label-Caps** should be used for small headings above titles (breadcrumbs or categories), colored in the primary blue or a muted gray.

## Layout & Spacing

The layout philosophy follows a **Rigid Fluidity** model. 

- **Desktop:** A 12-column grid with a fixed sidebar for admin/internal views. For the public portfolio, a centered 12-column grid with generous 64px side margins is preferred.
- **Mobile:** A single-column flow with 20px margins. Sidebars collapse into a bottom-anchored navigation bar or a top glassmorphic menu.
- **Spacing Rhythm:** All spacing must be multiples of 4px. Use 24px (gutter) as the standard gap between related card elements and 48px-64px for section vertical spacing.

## Elevation & Depth

Hierarchy is established through "Luminous Layering." Instead of traditional heavy shadows, this design system uses:

1.  **Level 0 (Background):** Pure black (#050505).
2.  **Level 1 (Cards/Containers):** Deep Navy (#0A0C10) with a 1px subtle border (`white / 10%`).
3.  **Level 2 (Floating/Hover):** Deep Navy with a soft, expansive shadow: `0 20px 40px rgba(0,0,0,0.4)` and a slightly brighter border (`white / 20%`).
4.  **Glassmorphism:** Navigation bars use a backdrop blur of `20px` and a semi-transparent fill of `#0A0C10 / 70%`.

**Border Treatment:** Use "inner-glow" borders—1px solid strokes that are slightly lighter than the surface they sit on to simulate a beveled, high-end hardware edge.

## Shapes

The shape language balances approachability with precision.
- **Standard Radius:** 12px for cards, input fields, and large buttons. This provides a "hardware" feel similar to modern smartphones.
- **Large Radius:** 24px (Rounded-XL) for featured hero cards or image containers.
- **Interactive Elements:** Buttons utilize the standard 12px radius, but technical tags (chips) can use a full "pill" radius (3rem) to contrast against the structural grid.

## Components

**Buttons**
- **Primary:** Electric Blue background, white text. No shadow, but a subtle "inner-top-white-stroke" at 10% opacity to give it a tactile feel.
- **Secondary:** Ghost style. Transparent background with a 1px white/10% border. Turns white/10% on hover.

**Cards**
- Cards must have a 1px border. In dark mode, the border is `rgba(255,255,255,0.1)`. 
- **Interactive Cards:** On hover, the border color transitions to the primary blue and the background lifts slightly with a shadow.

**Inputs**
- Inputs are dark-filled (#050505) with 12px rounded corners.
- Focus state: A 2px Electric Blue ring with a 4px blur.

**Chips / Tech Tags**
- Small, monospaced text.
- Dark mode: Background `#16181D`, text `#666666`. 
- Use for languages (e.g., TypeScript, Rust) or status indicators.

**Glass Header**
- Fixed position. 
- Blur: 12px. 
- Bottom border: 1px solid `rgba(255,255,255,0.05)`.